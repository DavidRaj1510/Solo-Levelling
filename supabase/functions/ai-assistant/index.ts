
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    // Generate text response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Beru, a loyal servant to the user who is the King/Queen. You give advice about self-improvement, tasks, and missions to help the user become a better person. Keep responses direct and helpful, focusing on practical self-improvement advice. Suggest new tasks and missions they could undertake to improve themselves. Your responses should sound like Beru from Solo Leveling.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    let audioBase64 = null;
    try {
      // Now get the audio for the response
      const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: generatedText,
          voice: 'onyx', // Deep, authoritative male voice for Beru
          response_format: 'mp3',
        }),
      });

      if (audioResponse.ok) {
        // Convert audio to base64
        const audioBuffer = await audioResponse.arrayBuffer();
        audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      } else {
        console.error('Audio generation failed:', await audioResponse.text());
        // We'll continue without audio if it fails
      }
    } catch (audioError) {
      console.error('Error generating audio:', audioError);
      // Continue without audio if there's an error
    }

    return new Response(JSON.stringify({ 
      text: generatedText,
      audio: audioBase64
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackText: "My apologies, King. I'm having trouble connecting to my powers at the moment. Please try again later or ask something else."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
