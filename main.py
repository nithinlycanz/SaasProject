from summaryAgent import process_video
from classificationAgent import process_images
from promptAgent import generate_thumbnail_prompt
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import base64
import time
import asyncio
from concurrent.futures import ThreadPoolExecutor
import yt_dlp

# Load the API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

def extract_video_metadata(url):
    """Extract video metadata using yt-dlp"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                'channel_name': info.get('channel', ''),
                'video_title': info.get('title', ''),
                'description': info.get('description', ''),
                'tags': info.get('tags', [])
            }
    except Exception as e:
        print(f"Warning: Failed to fetch video metadata: {str(e)}")
        return None

async def process_video_async(url):
    """Run video processing in a thread pool"""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        return await loop.run_in_executor(pool, process_video, url)

async def process_images_async(image_paths):
    """Run image processing in a thread pool"""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        return await loop.run_in_executor(pool, process_images, image_paths)

async def fetch_metadata_async(url):
    """Run metadata fetching in a thread pool"""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        return await loop.run_in_executor(pool, extract_video_metadata, url)

async def main_async():
    print("=== YouTube Thumbnail Generator ===")
    
    # Get video URL and image preference upfront
    print("\nEnter YouTube video URL:")
    url = input("> ").strip()
    
    print("\nDo you want to use existing images? (yes/no)")
    use_existing = input("> ").lower().strip() == "yes"
    
    # Start all tasks immediately
    video_task = asyncio.create_task(process_video_async(url))
    metadata_task = asyncio.create_task(fetch_metadata_async(url))
    
    # Initialize image task as None
    image_task = None
    image_paths = []
    
    # If using existing images, collect paths and start processing immediately
    if use_existing:
        print("\nEnter the paths to your images (one per line, press Enter twice when done):")
        while True:
            path = input("> ").strip()
            if not path:
                break
            if os.path.exists(path):
                image_paths.append(path)
            else:
                print(f"Warning: File not found: {path}")

        if not image_paths:
            print("No valid images provided. Exiting...")
            return
            
        # Start image processing immediately after getting paths
        print(f"\nAnalyzing {len(image_paths)} images...")
        image_task = asyncio.create_task(process_images_async(image_paths))

    # Wait for all tasks to complete
    video_data = await video_task
    metadata = await metadata_task
    
    if not video_data:
        print("Failed to process video. Exiting...")
        return
    
    print("\nVideo Summary:")
    print(video_data["summary"])
    
    if metadata:
        print("\nVideo Metadata:")
        print(f"Channel: {metadata['channel_name']}")
        print(f"Title: {metadata['video_title']}")
        print(f"Description: {metadata['description']}")
        if metadata['tags']:
            print(f"Tags: {', '.join(metadata['tags'][:5])}...")
    
    # Get image analysis results if we were processing images
    if use_existing:
        image_analysis = await image_task
        if not image_analysis:
            print("Failed to analyze images. Exiting...")
            return
    else:
        # Create a default image classification for generation
        image_analysis = {
            "images": [{
                "type": "generated",
                "description": "A new image will be generated",
                "suitable_for": "main thumbnail"
            }]
        }
    
    # Step 3: Generate thumbnail prompt
    print("\nStep 3: Generating Thumbnail Prompt")
    print("Enter brand theme (press Enter to skip):")
    brand_theme = input("> ").strip() or None
    
    # Enhance the prompt generation with metadata
    prompt = generate_thumbnail_prompt(
        video_data["summary"],
        image_analysis["images"],
        brand_theme,
        metadata=metadata  # Pass metadata to prompt generation
    )
    
    if not prompt:
        print("Failed to generate prompt. Exiting...")
        return
    
    print("\nGenerated Prompt:")
    print(prompt)
    
    # Step 4: Generate or edit image
    print("\nStep 4: Image Generation")
    if use_existing and image_paths:
        # Automatically use edit mode since we have images
        print("Editing existing images...")
        request_params = {
            "model": "gpt-image-1",
            "image": [open(path, "rb") for path in image_paths],
            "prompt": prompt,
            "n": 1,
            "quality": "high",
            "size": "auto",
        }
        img = client.images.edit(**request_params)
        
        # Close all opened image files
        for file in request_params["image"]:
            file.close()
    else:
        # Generate new image
        print("Generating new image...")
        request_params = {
            "model": "gpt-image-1",
            "prompt": prompt,
            "n": 1,
            "quality": "high",
            "size": "1536x1024",
        }
        img = client.images.generate(**request_params)
    
    # Save the generated image
    image_bytes = base64.b64decode(img.data[0].b64_json)
    output_filename = f"thumbnail_{int(time.time())}.png"
    with open(output_filename, "wb") as f:
        f.write(image_bytes)
    
    print(f"\nThumbnail saved as: {output_filename}")
    print("\nProcess completed successfully!")

def main():
    asyncio.run(main_async())

if __name__ == "__main__":
    main() 