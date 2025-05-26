from summaryAgent import process_video
from classificationAgent import process_images
from promptAgent import generate_thumbnail_prompt
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import base64
import time

# Load the API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

def main():
    print("=== YouTube Thumbnail Generator ===")
    
    # Step 1: Get video summary
    print("\nStep 1: Video Analysis")
    print("Enter YouTube video URL:")
    url = input("> ").strip()
    
    video_data = process_video(url)
    if not video_data:
        print("Failed to process video. Exiting...")
        return
    
    print("\nVideo Summary:")
    print(video_data["summary"])
    
    # Step 2: Process images
    print("\nStep 2: Image Analysis")
    print("Do you want to use existing images? (yes/no)")
    use_existing = input("> ").lower().strip() == "yes"
    
    image_paths = []  # Store image paths
    if use_existing:
        # Get image paths from user
        print("Enter the paths to your images (one per line, press Enter twice when done):")
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

        print(f"\nAnalyzing {len(image_paths)} images...")
        image_analysis = process_images(image_paths)
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
    
    prompt = generate_thumbnail_prompt(
        video_data["summary"],
        image_analysis["images"],
        brand_theme
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

if __name__ == "__main__":
    main() 