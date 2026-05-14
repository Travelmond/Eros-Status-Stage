# Eros Status Stage - Image Generation API Setup Guide

**Version:** 1.0  
**Date:** May 2026  
**Purpose:** Step-by-step guide to set up AI image generation for Eros Status Stage

---

## 1. Overview

The Eros Status Stage includes an **Expression/Pose Section** that allows users to:
- View current character expression and pose
- Generate AI image prompts automatically
- Copy tags for manual image generation
- Generate images directly (when API is configured)

---

## 2. Supported Image Generation APIs

The Stage supports multiple image generation APIs:

### 2.1 OpenAI Compatible APIs
- **OpenAI** (GPT Image generation)
- **Stable Diffusion** (via Stability AI API)
- **Midjourney** (via third-party proxies)
- **Leonardo.ai**
- **Craiyon**
- Any API compatible with OpenAI's `/v1/images/generations` endpoint

### 2.2 Direct APIs
- **Stable Diffusion Web UI** (local)
- **ComfyUI** (local)
- **Horde** (distributed generation)

---

## 3. API Configuration Steps

### Step 1: Choose Your Image Generation Service

| Service | Cost | Quality | Speed | Notes |
|---------|------|----------|-------|-------|
| **OpenAI DALL-E 3** | Pay-per-use | Excellent | Fast | Best quality |
| **Stable Diffusion** | Free/Paid | Good | Medium | Requires API key |
| **Leonardo.ai** | Free tier available | Good | Fast | Good free tier |
| **Local (SD Web UI)** | Free (GPU required) | Good | Depends on hardware | Best for privacy |

### Step 2: Obtain API Key

#### For OpenAI:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy and save the key (it won't be shown again)

#### For Stable Diffusion (Stability AI):
1. Go to [platform.stability.ai](https://platform.stability.ai)
2. Sign up/Login
3. Go to **API Keys**
4. Create a new key

#### For Leonardo.ai:
1. Go to [leonardo.ai](https://leonardo.ai)
2. Sign up/Login
3. Go to **Account Settings** → **API**
4. Generate API key

### Step 3: Configure the Stage

#### Option A: Via Environment Variables (Recommended for production)

Add to your deployment environment:
```bash
# For OpenAI
EROS_IMAGE_API_PROVIDER=openai
EROS_IMAGE_API_KEY=sk-your-key-here
EROS_IMAGE_MODEL=dall-e-3

# For Stability AI
EROS_IMAGE_API_PROVIDER=stability
EROS_IMAGE_API_KEY=sk-your-key-here
EROS_IMAGE_MODEL=stable-diffusion-xl-1024-v1-0
```

#### Option B: Via GitHub Secrets (for Chub deployment)

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add new secrets:
   - `EROS_IMAGE_API_KEY` - Your API key
   - `EROS_IMAGE_API_PROVIDER` - Provider name (openai, stability, leonardo)

#### Option C: Via Settings File (for local development)

Create `eros-config.json` in the project root:
```json
{
  "imageGeneration": {
    "provider": "openai",
    "apiKey": "sk-your-key-here",
    "model": "dall-e-3",
    "defaultSize": "1024x1024",
    "quality": "standard"
  }
}
```

---

## 4. API Integration Code

### 4.1 Image Generation Service

The Stage includes an image generation service at `src/systems/generation/imageGenerator.ts`:

```typescript
// src/systems/generation/imageGenerator.ts
export interface ImageGenerationRequest {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    steps?: number;
    cfgScale?: number;
    model?: string;
}

export interface ImageGenerationResponse {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

export class ImageGenerator {
    private apiKey: string;
    private provider: string;
    private model: string;

    constructor(config: ImageConfig) {
        this.apiKey = config.apiKey;
        this.provider = config.provider;
        this.model = config.model || 'dall-e-3';
    }

    async generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
        switch (this.provider) {
            case 'openai':
                return this.generateOpenAI(request);
            case 'stability':
                return this.generateStability(request);
            case 'leonardo':
                return this.generateLeonardo(request);
            default:
                return { success: false, error: 'Unknown provider' };
        }
    }

    private async generateOpenAI(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: request.prompt,
                    n: 1,
                    size: `${request.width || 1024}x${request.height || 1024}`,
                    quality: request.quality || 'standard',
                    response_format: 'url'
                })
            });

            const data = await response.json();
            
            if (data.error) {
                return { success: false, error: data.error.message };
            }

            return { 
                success: true, 
                imageUrl: data.data[0].url 
            };
        } catch (error) {
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
}
```

### 4.2 Usage in Component

```tsx
// In GenerateImageButton.tsx
import { ImageGenerator } from '../../systems/generation/imageGenerator';

const handleGenerate = async () => {
    setIsGenerating(true);
    
    const generator = new ImageGenerator({
        apiKey: 'your-api-key',
        provider: 'openai',
        model: 'dall-e-3'
    });
    
    const result = await generator.generate({
        prompt: aiPrompt, // Generated from character state
        width: 1024,
        height: 1024
    });
    
    if (result.success) {
        setGeneratedImageUrl(result.imageUrl);
    } else {
        setError(result.error);
    }
    
    setIsGenerating(false);
};
```

---

## 5. Prompt Generation

The Stage automatically generates prompts from character state:

### 5.1 Prompt Template

```typescript
// Character attributes
const prompt = `
    ${character.gender}, ${character.age} years old,
    ${expression.description}, ${pose.description},
    ${clothing.description},
    ${setting.description},
    ${lighting},
    ${qualityTags}
`.join(', ');
```

### 5.2 Tag Categories

| Category | Tags |
|----------|------|
| **Character** | 1girl, solo, masterpiece, detailed |
| **Expression** | happy, sad, blushing, surprised |
| **Pose** | sitting, standing, hands clasped |
| **Clothing** | dress, uniform, casual |
| **Environment** | bedroom, outdoor, studio |
| **Quality** | 8k, masterpiece, best quality |

---

## 6. Testing the Integration

### 6.1 Local Testing

1. Start the development server:
   ```bash
   cd stage/Eros-Status-Stage
   yarn dev --host --mode staging
   ```

2. Open the Stage in your browser
3. Navigate to **Extras** → **Expressions**
4. Click **Generate Image**
5. If API is not configured, you'll see: "Image generation not available. Configure API in settings."

### 6.2 Verify API Connection

Test your API key with a simple curl command:

```bash
# For OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# For Stability AI
curl https://api.stability.ai/v1/user/account \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 7. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **"API key not configured"** | Add `EROS_IMAGE_API_KEY` to environment |
| **"Rate limit exceeded"** | Wait and retry, or upgrade plan |
| **"Invalid API key"** | Verify key in provider dashboard |
| **"Model not found"** | Check model name matches provider |
| **"Content policy violation"** | Modify prompt to comply with policy |

### Debug Mode

Enable debug logging:
```typescript
const generator = new ImageGenerator({
    apiKey: 'your-key',
    provider: 'openai',
    debug: true  // Enable verbose logging
});
```

---

## 8. Privacy Considerations

### 8.1 Local Generation
For maximum privacy, run Stable Diffusion locally:
- Use **Stable Diffusion Web UI** or **ComfyUI**
- Set provider to `local`
- Point to `http://localhost:7860/v1/generation`

### 8.2 Data Handling
- Character images are generated on-demand
- No images are stored on server
- API keys are encrypted at rest

---

## 9. Cost Estimation

| Provider | Cost per image | Free tier |
|----------|---------------|-----------|
| OpenAI DALL-E 3 | $0.04-0.08 | No |
| OpenAI DALL-E 2 | $0.016-0.02 | No |
| Stability AI | $0.003-0.01 | 100/month |
| Leonardo.ai | $0.002-0.01 | 150/day |

---

## 10. Related Files

| File | Purpose |
|------|---------|
| `src/components/expression/ExpressionPoseSection.tsx` | Main UI component |
| `src/components/expression/AIPromptDisplay.tsx` | Prompt display |
| `src/components/expression/GenerateImageButton.tsx` | Generate button |
| `src/systems/generation/imageGenerator.ts` | API client |
| `src/utils/promptGenerator.ts` | Prompt building |

---

**Document Version:** 1.0  
**Last Updated:** May 2026