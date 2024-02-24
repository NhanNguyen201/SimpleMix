export default {
    vertex: `
        varying vec2 vUv;
        uniform float uTime;
        varying float vWave;

        float PI = 3.141618;
        float fre = 2.;

        vec2 hash( vec2 p ) {
            p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
        }

        float noise( vec2 p ){
            const float K1 = 0.366025404; // (sqrt(3)-1)/2;
            const float K2 = 0.211324865; // (3-sqrt(3))/6;

            vec2  i = floor( p + (p.x+p.y)*K1 );
            vec2  a = p - i + (i.x+i.y)*K2;
            float m = step(a.y,a.x); 
            vec2  o = vec2(m,1.0-m);
            vec2  b = a - o + K2;
            vec2  c = a - 1.0 + 2.0*K2;
            vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
            vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
            return dot( n, vec3(70.0) );
        }
        void main() {
            vUv = uv ;
            vec2 noisePos = vec2((vUv.x + uTime * .5) * fre, (vUv.y  - uTime * .2) * fre);   
            
            vWave = noise(noisePos) ;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform sampler2D uTexture1; 
        uniform sampler2D uTexture2; 
        uniform sampler2D uMap; 

        uniform float uTime;

        varying vec2 vUv;
        varying float vWave;

        vec4 toRgb (vec4 c) {
            return vec4(c[0] / 255., c[1] / 255., c[2] / 255., c[3] );
        }
        void main() {

            float wave = vWave * 0.45; // 0.45
            float line = 0.;
            float lineEdge = 0.05;

            vec4 tMap = texture2D(uMap, fract(vUv + uTime));
            vec4 t2 = texture2D(uTexture2, vUv);

            float r1 = texture2D(uTexture1, vUv + wave * 0.09).r; // turn pink
            float g1 = texture2D(uTexture1, vUv + wave * 0.02).g;
            float b1 = texture2D(uTexture1, vUv + wave * 0.1).b;

            vec4 t1 = vec4(r1, g1, b1, 1.);

            // image in the star
            vec4 mix1 = mix(
                vec4(tMap.rgb * (vWave + 1.5), 1.),  // lighten the tMap texture
                t2, 
                step( 0.4,  dot(tMap.rgb , vec3(1.0)) * vWave * length(tMap.rg * tMap.gb * tMap.br) )
            );


            // vWave over 0. 
            vec4 mix2 = mix(
                t2, 
                mix1,  
                step( 0.6,  dot(tMap.rgb , vec3(1.0)) * (vWave  + 0.15) )
            );

            vec4 c1 = toRgb(vec4(216., 76., 21., 1.)); // orange
            vec4 c2 = toRgb(vec4(69., 0., 247., 1.)); // violet

            vec4 texture = mix(
                mix(t1, c1, smoothstep(line - lineEdge, line, vWave)), 
                mix(c2, mix2, smoothstep(line, line + lineEdge, vWave)), 
                step(line, vWave)
            );

            gl_FragColor = texture;
        }
    `
}