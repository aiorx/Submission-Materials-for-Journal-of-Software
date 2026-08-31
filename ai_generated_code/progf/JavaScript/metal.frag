// Supported via standard programming aids 19/06/2024

#version 330 core

out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

uniform vec3 lightPos;
uniform vec3 viewPos;

uniform sampler2D albedoMap;
uniform sampler2D normalMap;
uniform sampler2D metallicMap;
uniform sampler2D roughnessMap;

void main()
{
    vec3 albedo = texture(albedoMap, TexCoords).rgb;
    float metallic = texture(metallicMap, TexCoords).r;
    float roughness = texture(roughnessMap, TexCoords).r;

    vec3 ambient = vec3(0.03) * albedo;
    
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 viewDir = normalize(viewPos - FragPos);
    
    // Calculate reflectance at normal incidence
    vec3 F0 = mix(vec3(0.04), albedo, metallic);
    
    // Calculate specular reflection
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float NDF = distributionGGX(norm, halfwayDir, roughness);
    float G = geometrySmith(norm, viewDir, lightDir, roughness);
    vec3 F = fresnelSchlick(max(dot(halfwayDir, viewDir), 0.0), F0);
    
    vec3 numerator = NDF * G * F;
    float denominator = 4.0 * max(dot(norm, viewDir), 0.0) * max(dot(norm, lightDir), 0.0);
    vec3 specular = numerator / max(denominator, 0.001);
    
    // Calculate diffuse reflection
    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic;
    float NdotL = max(dot(norm, lightDir), 0.0);
    
    vec3 Lo = (kD * albedo / PI + specular) * lightColor * NdotL;
    
    vec3 color = ambient + Lo;
    FragColor = vec4(color, 1.0);
}

float distributionGGX(vec3 N, vec3 H, float roughness)
{
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    
    float num = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    
    return num / denom;
}

float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float ggx1 = geometrySchlickGGX(max(dot(N, V), 0.0), roughness);
    float ggx2 = geometrySchlickGGX(max(dot(N, L), 0.0), roughness);
    return ggx1 * ggx2;
}

float geometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;
    
    float num = NdotV;
    float denom = NdotV * (1.0 - k) + k;
    
    return num / denom;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

