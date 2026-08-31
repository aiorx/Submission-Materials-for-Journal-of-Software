import { NextRequest, NextResponse } from "next/server";

// The following code handles text-to-speech requests using the ElevenLabs API.
// If the API key is not configured, it falls back to browser speech synthesis.
// It returns audio data in response to POST requests with a JSON body containing the text to be spoken.
// I have used Basic development code blocks as a starting point for this implementation.
// Minor tweaks have been added to ensure that it works with the current implementation.


// Sends a POST request to the ElevenLabs API for text-to-speech conversion.
export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.ELEVENLABS_API_KEY) {
            console.warn(
                "ElevenLabs API key not configured, using fallback browser speech synthesis"
            );

            // Return a special response to indicate fallback should be used
            return NextResponse.json({ fallback: true, text }, { status: 200 });
        }

        // Try to use ElevenLabs API with simple fetch
        try {
            const response = await fetch(
                "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
                {
                    method: "POST",
                    headers: {
                        Accept: "audio/mpeg",
                        "Content-Type": "application/json",
                        "xi-api-key": process.env.ELEVENLABS_API_KEY,
                    },
                    body: JSON.stringify({
                        text,
                        model_id: "eleven_monolingual_v1",
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75,
                            style: 0.0,
                            use_speaker_boost: true,
                        },
                    }),
                }
            );

            if (response.ok) {
                const audioBuffer = await response.arrayBuffer();

                return new NextResponse(audioBuffer, {
                    status: 200,
                    headers: {
                        "Content-Type": "audio/mpeg",
                        "Content-Length": audioBuffer.byteLength.toString(),
                    },
                });
            } else {
                console.error(
                    "ElevenLabs API error:",
                    response.status,
                    response.statusText
                );
                // Return fallback response on API error
                return NextResponse.json(
                    { fallback: true, text },
                    { status: 200 }
                );
            }
        } catch (apiError) {
            console.error("ElevenLabs API error:", apiError);
            // Return fallback response on API error
            return NextResponse.json({ fallback: true, text }, { status: 200 });
        }
    } catch (error) {
        console.error("Text-to-speech error:", error);

        // Return fallback response on error
        return NextResponse.json(
            {
                fallback: true,
                text: "Error occurred during text-to-speech processing",
            },
            { status: 200 }
        );
    }
}
