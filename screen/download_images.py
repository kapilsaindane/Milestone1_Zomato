#!/usr/bin/env python3
"""
Download images from the FeastFind HTML file to the screen folder
"""

import requests
import os
from urllib.parse import urlparse

# Image URLs from the HTML file
images = [
    {
        "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCfBKnwNQUSWyGbDwbXMBz7qVVIpGyjGNuLp2g5xjkU9OLMqs7lvo12eqrS5TXJ04siIEx4HVj_pyYtYdEhdSPK1p5-8lp2zD4X1Hm8yJCFd0E_Xahh3FU28fZPZhdInjy320lILI968yC7jJ0EYfeoOvJUu6hUOnxKBCdHHZUWFugKBDc6xVzC-CGbnj49nGmOh3UHeBuLlGBF7mT4nn4h6-M5Lr33BFtnaCJ31a0kThFVM7XRqHv00niIgEMs-yc-5tS9Z1bIKQ",
        "filename": "user_profile.jpg",
        "description": "User profile picture"
    },
    {
        "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ao2DJ1Sly7qAyw66FU-UwyqxoMZvxjQwgDd1CSvzCEPRod94M8hDNra0BZSRm30Ff6Z7wYaFBdkZ-rdsRw8J7lCmikS6I34JgNhLlSOc7ZfIZ1dNupVMfzWefRgxJAT_U88SKzXhBN-UMcqPDMq75bp9n_u7b7NWrpI1FlxDAhwP7QTpsGhWh_ETfkC0idW4Ezq9Bxic02CXUik3XsEx06Nve34RLp9bnrs0JdhR-f2oRH_cfdJLXsBViuL-2Q-dzQ_4tffEsA",
        "filename": "hero_background.jpg",
        "description": "Hero section background - dining table with gourmet dishes"
    },
    {
        "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC7BHqnBp0N5oPEjr_KNRDhN9zNnfjRwTdE2YPDOVgpd25npjzvYfYOFo0BZvit9Hi3_Ehsiv-DCvXRqpvEAKGcP7d-3eVkkwRD3xLEM2jE74O5r6D8RFkVmeSZOoMDTagjRQdju3s9hL55v2DK-DXLMtD_PZ3-1gcdYTnkIqWrpDNes7zohvQCOok1tlVajXqDppphpXyBIRds1BxY-JByKq-QuQe13C8x0wN-YVvAhVWcqi1qSIoPqli4bwVu4a4TYew8BRTnJQ",
        "filename": "restaurant_lumina.jpg",
        "description": "Lumina Osteria interior"
    },
    {
        "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAZgtBNho8Pj1piEXGbYJR5IJXC3sQV0fN9kDB1PeLOKRsrAaSjadBLRMomeCpzq6qQJmQDe3QpIFoV281RBvGjHNiy9NxSgn8vFT7Zn6n0Q6esMT7bQaaGU4w6Wo9NznPsyqeWmX4CO11CgqScBjeFiprdyqeuDUIHlBoVPpg-E5Q1owr_oS6ysdQ1XspDrBpmEzIrccXw7Sf-LIPkPDPyOlnkvoowgQ4_1g-jDFOUcrymQqVlm9lTxTDTg8j_aU0b5xvSIwY34w",
        "filename": "restaurant_zenith.jpg",
        "description": "The Zenith interior"
    },
    {
        "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuACzbRm_rlSYC_o9tPXnBOr14sNkz52mS8hgQuDQUmHVxi-yaa2F1hvPBElxudvqOV4IgDzw_VNq20r9WGlaaQSEvfobTtjXmNLFBTANDzwEdou6sBDiENojrmogrm2l3ha-t_8DHqGdNZEdL0RhI3oLnW2BJlNqbtKq38sLuW8lTmHY2dv3ON-pBTDE91k-AkYfCnlXka-YoRoZZWryuqpOiMvH9ABAJfdg0jTUTMkbbd7o_Irpc-7sZ7_icXFfwCfNx5JlKNpKw",
        "filename": "restaurant_kizu.jpg",
        "description": "Kizu Sushi interior"
    },
    {
        "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuClxfZohvUGcUmYF5m91GPUuPlvGuI-nLG1AXtsmLpaqo0AbiOMBGnQST-IXhK9kHJjoeEXaMcIMG0AvL2rHyIXkfpisOIXFjjTa3L0omA75ExS1lVbwRevIKN671QAdyiqHP2t25rOXk7s5ULn5LcAL7A9aems5QYbjZJix0NNvoq0J247cTurrYI80vrRpOoTAW9f4OAiSAWAOKXZhZtgvry2cOrvFMYRj6cZ0m8Iwl10t6tvK2mBCS41BT8A09sfq6KL_-CVRg",
        "filename": "restaurant_verdant.jpg",
        "description": "Verdant Cafe interior"
    }
]

def download_image(url, filename, description):
    """Download an image from URL and save it to the screen folder"""
    try:
        print(f"Downloading {description}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        filepath = os.path.join(os.path.dirname(__file__), filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"[SUCCESS] Downloaded {filename}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to download {filename}: {e}")
        return False

def main():
    """Download all images"""
    print("Starting image downloads...")
    
    success_count = 0
    for image in images:
        if download_image(image["url"], image["filename"], image["description"]):
            success_count += 1
    
    print(f"\n[SUMMARY] Download Summary: {success_count}/{len(images)} images downloaded successfully")
    print("[INFO] Images saved to: screen/ folder")

if __name__ == "__main__":
    main()
