from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from google import genai
from dotenv import load_dotenv
import os
import re

# Load environment variables
load_dotenv()

# Configure Gemini
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    # Regular expressions for different YouTube URL formats
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)',
        r'youtube\.com\/embed\/([^&\n?]+)',
        r'youtube\.com\/v\/([^&\n?]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_transcript(video_id):
    """Get transcript for a YouTube video"""
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        # Format transcript into a single string
        formatted_transcript = " ".join([entry['text'] for entry in transcript])
        return formatted_transcript
    except Exception as e:
        print(f"Error getting transcript: {str(e)}")
        return None

def summarize_transcript(transcript):
    """Summarize transcript using Gemini"""
    try:
        prompt = f"""You are an expert at summarizing video content for media applications. Your task is to read the transcript of a YouTube video and generate a concise and engaging summary. This summary will be used to create a YouTube thumbnail, so it should:
        - Capture the topic clearly
        - Highlight the emotional tone (funny, inspirational, dramatic, etc.)
        - Identify any main characters, settings, or actions
        - Be short (2–4 sentences)

        Transcript:
        {transcript}

        Now summarize it based on the criteria above.
        """
        
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-04-17",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return None

def process_video(url):
    """Process a YouTube video: get transcript and generate summary"""
    # Extract video ID
    video_id = extract_video_id(url)
    if not video_id:
        print("Invalid YouTube URL")
        return None
    
    # Get transcript
    print("Fetching transcript...")
    transcript = get_transcript(video_id)
    if not transcript:
        return None
    
    # Generate summary
    print("Generating summary...")
    summary = summarize_transcript(transcript)
    if not summary:
        return None
    
    return {
        "video_id": video_id,
        "summary": summary
    }

if __name__ == "__main__":
    # Get YouTube URL from user
    print("Enter YouTube video URL:")
    url = input("> ").strip()
    
    # Process the video
    result = process_video(url)
    
    if result:
        print("\n=== Video Summary ===")
        print(result["summary"])
    else:
        print("Failed to process video") 