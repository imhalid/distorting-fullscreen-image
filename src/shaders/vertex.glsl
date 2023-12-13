uniform float uTime;
uniform float uProgress;
uniform float uDirection;

varying vec2 vUv;
varying float vProgress;

void main()
{
     vec3 pos = position;
    // pos.z += .1 *sin(pos.x*10.);
    // pos.z += mask * .5 * sin(uTime + pos.x * 10.);
    // float mask = smoothstep(.4, .5, distance);

    float distance = length(uv - vec2(.5));
    float maxDistance = length(vec2(.5));

    float normalizeDistance = distance / maxDistance;

    float stickTo = normalizeDistance;
    float stickOut = -normalizeDistance;

    float stickEffect = mix(stickTo, stickOut, uDirection);

    float mySuperDuperProgress = min(2. * uProgress, 2. * (1.-uProgress));
    float zOffset = 2.;


    float zProgress = mix(clamp(2. * uProgress, 0., 1.), clamp(1. - 2. * (1.- uProgress), 0., 1.), uDirection);
    pos.z += zOffset * (stickEffect * mySuperDuperProgress - zProgress);

    pos.z += uProgress*sin(distance*10. + 2.*uTime)*.1;
    vUv = uv;
    vProgress = uProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
