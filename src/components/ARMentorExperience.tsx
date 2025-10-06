import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';
import { Sparkles, X, Maximize2, Minimize2 } from 'lucide-react';

interface MentorAvatarProps {
  color: string;
  name: string;
}

const MentorAvatar = ({ color, name }: MentorAvatarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Main Avatar Body */}
        <mesh
          ref={meshRef}
          position={[0, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.3, 0.2, 0.9]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.3, 0.2, 0.9]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>

        {/* Orbiting Particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 1.8;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle + Date.now() * 0.001) * radius,
                Math.sin(angle * 2 + Date.now() * 0.002) * 0.5,
                Math.sin(angle + Date.now() * 0.001) * radius
              ]}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1}
              />
            </mesh>
          );
        })}

        {/* Name Tag */}
        <Html position={[0, -1.8, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30 shadow-lg">
            <p className="font-bold text-sm whitespace-nowrap">{name}</p>
          </div>
        </Html>
      </group>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const particles = new Float32Array(1000 * 3);
  for (let i = 0; i < 1000; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 20;
    particles[i * 3 + 1] = (Math.random() - 0.5) * 20;
    particles[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8b5cf6" transparent opacity={0.6} />
    </points>
  );
};

interface ARMentorExperienceProps {
  mentorName: string;
  mentorColor: string;
  departmentName: string;
  onClose: () => void;
}

const ARMentorExperience = ({
  mentorName,
  mentorColor,
  departmentName,
  onClose
}: ARMentorExperienceProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
          />
          
          <Suspense fallback={null}>
            <Environment preset="city" />
            <MentorAvatar color={mentorColor} name={mentorName} />
            <ParticleField />
          </Suspense>
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={3}
            maxDistance={15}
          />
        </Canvas>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={onClose}
          className="bg-background/80 backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Info Card */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/30 p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center animate-pulse"
              style={{ backgroundColor: `${mentorColor}40` }}
            >
              <Sparkles className="h-6 w-6" style={{ color: mentorColor }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{mentorName} is ready to help!</h3>
              <p className="text-sm text-muted-foreground">
                Drag to rotate • Scroll to zoom • Welcome to {departmentName}
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Start Learning
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ARMentorExperience;
