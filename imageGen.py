# Import the packages
from openai import OpenAI
from dotenv import load_dotenv
import os
import base64
import time
from PIL import Image
import io

# Load the API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

# Ask the user for inputs
print("Do you want to edit existing images? (yes/no)")
is_editing = input("> ").lower().strip() == "yes"

if is_editing:
    print("Enter the paths to your input images (one per line, press Enter twice when done):")
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
        exit()

    print(f"\nProcessing {len(image_paths)} images...")
    print("What modifications do you want to make to the images?")
    prompt = input("> ")
    print("Generating image...")

    # Prepare the request parameters for editing
    request_params = {
        "model": "gpt-image-1",
        "image": [open(path, "rb") for path in image_paths],
        "prompt": prompt,
        "n": 1,
        "quality": "high",
        "size": "auto",
    }

    # Send the prompt to the API for editing
    img = client.images.edit(**request_params)

    # Close all opened image files
    for file in request_params["image"]:
        file.close()

else:
    print("What image do you want to generate?")
    prompt = input("> ")
    print("Generating image...")

    # Prepare the request parameters for generation
    request_params = {
        "model": "gpt-image-1",
        "prompt": prompt,
        "n": 1,
        "quality": "high",
        "size": "1536x1024",
    }

    # Send the prompt to the API for generation
    img = client.images.generate(**request_params)

print("Prompt tokens:", img.usage.input_tokens_details.text_tokens)
print("Input images tokens:", img.usage.input_tokens_details.image_tokens)
print("Output image tokens:", img.usage.output_tokens)

# Save the image into a file named output.png
image_bytes = base64.b64decode(img.data[0].b64_json)
output_filename = f"output_{int(time.time())}.png"
with open(output_filename, "wb") as f:
    f.write(image_bytes)
print(f"Image saved as: {output_filename}")