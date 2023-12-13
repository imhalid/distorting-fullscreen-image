uniform sampler2D uTexture;
uniform vec4 uResolution;

varying vec2 vUv;
varying float vProgress;
void main()
{
     vec4 color = texture2D(uTexture, vUv);
      #include <tonemapping_fragment>
     gl_FragColor = color;
     // #include <colorspace_fragment>
     
}