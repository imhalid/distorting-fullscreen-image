uniform sampler2D uTexture;
uniform vec4 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;

varying vec2 vUv;
varying float vProgress;
void main()
{
 float normalizeSpeed = clamp(uSpeed * 40., 0.0, 1.0);
 float mouseDist = length(uMouse - vUv);

 float c = smoothstep(0.2 * normalizeSpeed, 0., mouseDist);
 vec4 color = texture2D(uTexture, vUv);

 float r = texture2D(uTexture, vUv + .1 * 0.5 * c * normalizeSpeed).r;
 float g = texture2D(uTexture, vUv + .1 * 0.3 * c * normalizeSpeed).g;
 float b = texture2D(uTexture, vUv + .1 * 0.1 * c * normalizeSpeed).b;
 gl_FragColor = color;
 gl_FragColor = vec4(r, g, b, 1.0);
}