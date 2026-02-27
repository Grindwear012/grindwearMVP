import os
import re

def fix_env():
    env_file = '.env'
    if not os.path.exists(env_file):
        print(f"Error: {env_file} not found.")
        return

    with open(env_file, 'r') as f:
        content = f.read()

    # Regex to find FIREBASE_PRIVATE_KEY and its potentially multi-line value
    # Capture everything from BEGIN to END markers
    pattern = re.compile(r'(FIREBASE_PRIVATE_KEY\s*=\s*)(.*?-----END PRIVATE KEY-----[\s"\'\\]*)', re.DOTALL)
    
    match = pattern.search(content)
    if not match:
        # Fallback: look for just the PEM block if the var name isn't matched perfectly
        pattern = re.compile(r'-----BEGIN PRIVATE KEY-----.*?-----END PRIVATE KEY-----', re.DOTALL)
        match = pattern.search(content)
        if not match:
            print("No private key block found.")
            return
        prefix = "FIREBASE_PRIVATE_KEY="
        key_block = match.group(0)
    else:
        prefix = match.group(1)
        key_block = match.group(2)

    # Cleanup the key block
    # 1. Strip whitespace, quotes, and common artifacts like commas or backslashes
    key_block = key_block.strip().strip('"').strip("'").rstrip(',').rstrip('\\')
    
    # 2. Split by newlines, carriage returns, or commas
    parts = re.split(r'[\n\r,]+', key_block)
    
    # 3. Clean each part and handle literal \n if they exist
    flat_parts = []
    for p in parts:
        cleaned = p.strip().strip('"').strip("'")
        if cleaned:
            # Handle cases where some parts already have \n
            flat_parts.extend(cleaned.split('\\n'))
    
    # 4. Rejoin with literal \n characters
    final_key = "\\n".join([p for p in flat_parts if p])
    
    # Reconstruct the line
    new_line = f'{prefix.strip()}="{final_key}"'
    
    # Replace the old block with the fixed single line
    if match.group(0) in content:
        new_content = content.replace(match.group(0), new_line)
    else:
        # Regex replacement if exact string match fails
        new_content = re.sub(r'FIREBASE_PRIVATE_KEY\s*=.*-----END PRIVATE KEY-----[\s"\'\\]*', new_line, content, flags=re.DOTALL)

    with open(env_file, 'w') as f:
        f.write(new_content)

    print("Success: .env file updated.")
    print(f"Key preview (first 100 chars):\n{final_key[:100]}...")

if __name__ == "__main__":
    fix_env()
