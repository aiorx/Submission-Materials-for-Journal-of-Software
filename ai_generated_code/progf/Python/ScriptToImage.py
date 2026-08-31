# Made by me
# from diffusers import DiffusionPipeline
# import torch
# import AddTextToImage

# pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
# pipe.to("cuda")

# def generate_images_from_script(comic_script):
#     # Iterate through each panel in the script
#     # Segment and print each JSON panel separately
#     for i, panel in enumerate(comic_script):
#         image = pipe(prompt=panel["panel art"]).images[0]
#         image.save(f"images/imagesWithoutText/panel_{i}.png")
#         image_with_text = AddTextToImage.add_text_to_panel(panel["text"], image)
#         image_with_text.save(f"images/imagesWithText/panel_{i}.png")
#         if i == 5:
#             return

#Built via standard programming aids
from diffusers import DiffusionPipeline
import torch
import AddTextToImage

pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    use_safetensors=True,
    variant="fp16"
)
pipe.load_lora_weights("lora/80sFantasyMovieMJ7SDXL.safetensors")
pipe.to("cuda")

# SDXL prompt builder function
def generate_sdxl_prompt(panel):
    camera_view = panel.get("camera_view", "")
    setting = panel.get("setting", "")
    lighting = panel.get("lighting", "")
    mood = panel.get("mood", "")
    action = panel.get("action", "")
    
    objects = ", ".join(panel.get("objects", []))
    characters = ", ".join(panel.get("characters", []))
    
    prompt = f"{camera_view}, {setting}, {lighting}, {mood} mood, {action}"
    if objects:
        prompt += f", {objects}"
    if characters:
        prompt += f", {characters}"
    
    negative_prompt = "deformed, blurry, extra limbs, poorly drawn hands, extra fingers, mutated, out of frame, ugly, tiling, low resolution, bad anatomy, watermark"
    
    return prompt.strip(), negative_prompt

def generate_images_from_script(comic_script):
    for i, panel in enumerate(comic_script):
        prompt, negative_prompt = generate_sdxl_prompt(panel)
        
        # SDXL image generation with negative prompt
        image = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=30,
            guidance_scale=7.5
            ).images[0]
        
        image.save(f"images/imagesWithoutText/panel_{i}.png")
        
        image_with_text = AddTextToImage.add_text_to_panel(panel["text"], image)
        image_with_text.save(f"images/imagesWithText/panel_{i}.png")
        
        if i == 5:  # To limit processing for testing
            return
