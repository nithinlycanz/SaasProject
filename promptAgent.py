from openai import OpenAI
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_thumbnail_prompt(video_summary, image_classifications, brand_theme=None, metadata=None):
    """Generate a thumbnail prompt using GPT-4"""
    try:
        # Format image classifications for the prompt
        image_info = "\n".join([
            f"Image {i+1}:\n" +
            f"- Type: {img['type']}\n" +
            f"- Description: {img['description']}\n" +
            f"- Suitable for: {img['suitable_for']}"
            for i, img in enumerate(image_classifications)
        ])

        # Format metadata for the prompt
        metadata_info = ""
        if metadata:
            metadata_info = f"""
        4. **Video Metadata**:
        - Channel: {metadata['channel_name']}
        - Title: {metadata['video_title']}
        - Tags: {', '.join(metadata['tags'][:5]) if metadata['tags'] else 'None'}
        """

        # Prepare the system prompt
        system_prompt = f"""You are an AI creative director for YouTube thumbnail design.

        Your job is to generate a **detailed and creative prompt** for an image generation model that will create a YouTube thumbnail.

        Use the following inputs:
        1. **Video summary**: {video_summary}
        2. **Image classifications**:
        {image_info}
        3. **Brand Theme**: {brand_theme if brand_theme else 'Not specified'}{metadata_info}

        ✅ Guidelines:
        - The  thumbnail must fit a **1536×1024 resolution**
        - Clearly instruct how to use the uploaded image (e.g., as central figure, background, or logo overlay)
        - If there is a logo, make sure it is in the corner of the thumbnail
        - Use descriptive language for visual style (vibrant, bold, dramatic, minimal, etc.)
        - If its a well known brand, suggest the brand theme in the prompt
        - Suggest color combinations if brand theme is provided
        - Use the Video Metadata to know more about the visual style and theme then use it to generate a more accurate prompt
        - Give suggestions for the background, based on the video summary/theme
        - Include an example of text to show in the thumbnail
        - Text elements should be:
            * Large enough to be readable on YouTube
            * Not too oversized that they overflow or dominate the image
            * Positioned clearly (left/right/top/bottom)
        - If there's an uploaded image (like a face/logo), specify how and where it should be positioned (e.g., "on the left side", "as a background", etc.).
        - Keep everything inside safe zones, not near the image edges.
        - Use a style that is **eye-catching, modern, and YouTube-appropriate**.
        - Follow the user's **brand colors** if provided.
        - Use **engaging, click-worthy language** in the text
        - Start the prompt with "Create a YouTube thumbnail for a video about" or "Create a YouTube thumbnail"
        - Don't add anyother logos to the thumbnail, only the brand logo should be added if it is provided
        - The thumbnail should look **well-balanced** with no overcrowding.
        - Consider the video's channel style and existing thumbnails if available
        - Use the video's tags to inform the visual style and theme
        Output ONLY the prompt to be passed to the image generation model."""

        # Generate the prompt using GPT-4
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate a thumbnail prompt based on the provided information."}
            ],
            temperature=0.7,
            max_tokens=500
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error generating prompt: {str(e)}")
        return None

def process_inputs():
    """Process user inputs and generate thumbnail prompt"""
    print("=== YouTube Thumbnail Prompt Generator ===")
    
    # Get video summary
    print("\nEnter the video summary:")
    video_summary = input("> ").strip()
    
    # Get image classifications
    print("\nEnter image classifications (JSON format):")
    print("""Example: {
  "images": [
    {
      "type": "person",
      "description": "A smiling young man",
      "suitable_for": "central subject"
    },
    {
      "type": "logo",
      "description": "A minimalist brand logo",
      "suitable_for": "corner placement"
    }
  ]
}""")
    try:
        classifications_input = json.loads(input("> ").strip())
        image_classifications = classifications_input.get("images", [])
        if not image_classifications:
            raise ValueError("No images found in input")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Invalid input format: {str(e)}. Using default values.")
        image_classifications = [{
            "type": "person",
            "description": "A generic person",
            "suitable_for": "central subject"
        }]
    
    # Get brand theme (optional)
    print("\nEnter brand theme (press Enter to skip):")
    brand_theme = input("> ").strip() or None
    
    # Get video metadata (optional)
    print("\nEnter video metadata (JSON format):")
    print("""Example: {
  "channel_name": "Channel Name",
  "video_title": "Video Title",
  "tags": ["tag1", "tag2", "tag3"]
}""")
    try:
        metadata_input = json.loads(input("> ").strip())
        metadata = metadata_input.get("metadata", {})
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Invalid input format: {str(e)}. Using default values.")
        metadata = None
    
    # Generate the prompt
    print("\nGenerating thumbnail prompt...")
    prompt = generate_thumbnail_prompt(video_summary, image_classifications, brand_theme, metadata)
    
    if prompt:
        print("\n=== Generated Thumbnail Prompt ===")
        print(prompt)
        return prompt
    else:
        print("Failed to generate prompt")
        return None

if __name__ == "__main__":
    process_inputs() 