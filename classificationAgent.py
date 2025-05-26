from google import genai
from dotenv import load_dotenv
import os
import json
from PIL import Image
import base64
from io import BytesIO

# Load environment variables
load_dotenv()

# Configure Gemini
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_images(image_paths):
    """Analyze multiple images using Gemini Vision and return structured classification"""
    try:
        # Convert all images to base64
        base64_images = [encode_image_to_base64(path) for path in image_paths]
        
        # Prepare the system prompt
        system_prompt = """You are an AI vision assistant. Analyze the uploaded images and provide a detailed description for each. Your goal is to identify:
        1. The type of each image: Is it a person, a logo, a background, or something else?
        2. The visual characteristics: facial expression, pose, clothing, background, colors, and overall style
        3. What role each image can play in a YouTube thumbnail (e.g. central figure, branding element, backdrop)
        4. How these images could work together in a thumbnail composition

        Respond in structured JSON format like this:
        {
            "images": [
                {
                    "type": "person" | "logo" | "background" | "other",
                    "description": "A smiling young man wearing a hoodie, neutral background, good lighting",
                    "suitable_for": "central subject in a thumbnail"
                },
                {
                    "type": "logo",
                    "description": "A minimalist brand logo in white on transparent background",
                    "suitable_for": "branding element in corner"
                }
            ],
            "composition_suggestion": "Place the person as the main subject with the logo in the top-right corner"
        }"""

        # Prepare image parts
        image_parts = []
        for base64_image in base64_images:
            image_parts.append({
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": base64_image
                }
            })

        # Generate content with the images
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"text": system_prompt},
                        *image_parts
                    ]
                }
            ]
        )

        # Parse the response as JSON
        try:
            # Extract JSON from the response text
            json_str = response.text.strip()
            # Find JSON object in the text
            start_idx = json_str.find('{')
            end_idx = json_str.rfind('}') + 1
            if start_idx >= 0 and end_idx > start_idx:
                json_str = json_str[start_idx:end_idx]
                result = json.loads(json_str)
                return result
            else:
                raise ValueError("No JSON object found in response")
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {str(e)}")
            print("Raw response:", response.text)
            return None

    except Exception as e:
        print(f"Error analyzing images: {str(e)}")
        return None

def process_images(image_paths=None):
    """Process multiple images and return their classification"""
    if image_paths is None:
        # Get image paths from user
        print("Enter the paths to your images (one per line, press Enter twice when done):")
        image_paths = []
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
            return None

    print(f"\nAnalyzing {len(image_paths)} images...")
    result = analyze_images(image_paths)
    
    if result:
        print("\n=== Image Analysis ===")
        print(json.dumps(result, indent=2))
        return result
    else:
        print("Failed to analyze images")
        return None

if __name__ == "__main__":
    process_images() 