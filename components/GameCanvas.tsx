import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameState, PlayerEntity, PlatformEntity, EnemyEntity, CollectibleEntity, GameStats, Particle } from '../types';
import { PHYSICS, GAME_CONFIG, COLORS } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setStats: React.Dispatch<React.SetStateAction<GameStats>>;
  stats: GameStats;
}

interface DashTrail {
    x: number;
    y: number;
    width: number;
    height: number;
    facing: number;
    alpha: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, setStats, stats }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game State Refs
  const playerRef = useRef<PlayerEntity>({
    x: 100,
    y: 300,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    isGrounded: false,
    color: COLORS.PRIMARY_GREEN,
    facing: 1
  });

  const dashRef = useRef({
      active: false,
      timer: 0,
      cooldown: 0
  });

  const wallContactRef = useRef<number>(0); // 0: None, -1: Left Wall, 1: Right Wall
  const trailRef = useRef<DashTrail[]>([]);

  const platformsRef = useRef<PlatformEntity[]>([]);
  const enemiesRef = useRef<EnemyEntity[]>([]);
  const collectiblesRef = useRef<CollectibleEntity[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraRef = useRef({ x: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const scoreRef = useRef(0);
  const healthRef = useRef(GAME_CONFIG.START_HEALTH);
  const maxHealthRef = useRef(GAME_CONFIG.START_HEALTH);
  const canJumpRef = useRef(true);
  const doubleJumpAvailableRef = useRef(true);
  const canDashRef = useRef(true);

  // Animation Refs
  const frameCountRef = useRef(0);

  // Tutorial State
  const [tutorialText, setTutorialText] = useState<string | null>(null);

  useEffect(() => {
    healthRef.current = stats.health;
  }, [stats.health]);

  useEffect(() => {
    maxHealthRef.current = stats.maxHealth;
  }, [stats.maxHealth]);

  const initLevel = useCallback(() => {
    playerRef.current = {
      x: 100,
      y: 300,
      width: GAME_CONFIG.PLAYER_WIDTH,
      height: GAME_CONFIG.PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      isGrounded: false,
      color: COLORS.PRIMARY_GREEN,
      facing: 1
    };
    
    cameraRef.current.x = 0;
    scoreRef.current = stats.score;
    healthRef.current = stats.health;
    dashRef.current = { active: false, timer: 0, cooldown: 0 };
    frameCountRef.current = 0;
    wallContactRef.current = 0;
    trailRef.current = [];
    
    platformsRef.current = [];
    enemiesRef.current = [];
    collectiblesRef.current = [];
    particlesRef.current = [];

    if (gameState === GameState.TUTORIAL) {
        initTutorial();
    } else {
        platformsRef.current.push({
            id: 0,
            x: 0,
            y: GAME_CONFIG.CANVAS_HEIGHT - 80,
            width: 800,
            height: 80,
            type: 'ground'
        });
        generateChunk(800);
    }
  }, [stats.score, stats.health, gameState]);

  const initTutorial = () => {
      platformsRef.current.push({ id: 1, x: 0, y: 600, width: 800, height: 60, type: 'ground' });
      platformsRef.current.push({ id: 2, x: 950, y: 600, width: 400, height: 60, type: 'ground' });
      platformsRef.current.push({ id: 3, x: 1450, y: 500, width: 100, height: 20, type: 'platform' });
      platformsRef.current.push({ id: 4, x: 1700, y: 400, width: 500, height: 60, type: 'ground' });
      platformsRef.current.push({ id: 5, x: 2400, y: 400, width: 600, height: 60, type: 'ground' });
      
      // Wall Jump section
      platformsRef.current.push({ id: 50, x: 3100, y: 200, width: 40, height: 400, type: 'platform' });
      platformsRef.current.push({ id: 51, x: 3250, y: 200, width: 40, height: 400, type: 'platform' });
      platformsRef.current.push({ id: 52, x: 3400, y: 500, width: 200, height: 40, type: 'ground' });

      // Jump Pad section
      platformsRef.current.push({ id: 60, x: 3700, y: 500, width: 60, height: 20, type: 'jump_pad' });
      platformsRef.current.push({ id: 61, x: 3800, y: 200, width: 200, height: 40, type: 'ground' });


      collectiblesRef.current.push({ id: 100, x: 1100, y: 550, width: 20, height: 20, type: 'coin', color: '#FFD700', collected: false });
      enemiesRef.current.push({ id: 200, x: 2600, y: 360, width: 40, height: 40, vx: 0, patrolStartX: 2600, patrolEndX: 2600, color: COLORS.ACCENT_DANGER, type: 'patrol' });
      
      platformsRef.current.push({ id: 6, x: 4200, y: 350, width: 50, height: 300, type: 'finish' });
  };

  const generateChunk = (startX: number) => {
    let currentX = startX;
    for (let i = 0; i < 10; i++) {
      const gap = 120 + Math.random() * 120;
      const width = 150 + Math.random() * 300;
      const height = 40;
      const y = GAME_CONFIG.CANVAS_HEIGHT - 100 - Math.random() * 200;
      
      const platformX = currentX + gap;
      
      // Chance to spawn Jump Pad
      if (Math.random() > 0.9) {
          platformsRef.current.push({
              id: Date.now() + i + 9000,
              x: platformX + width/2 - 20,
              y: y - 10,
              width: 40,
              height: 10,
              type: 'jump_pad'
          });
      }

      if (Math.random() > 0.85) {
         platformsRef.current.push({
          id: Date.now() + i + 1000,
          x: platformX + width / 2 - 20,
          y: y - 20,
          width: 40,
          height: 20,
          type: 'hazard'
        });
      }

      platformsRef.current.push({
        id: Date.now() + i,
        x: platformX,
        y: y,
        width: width,
        height: height,
        type: 'platform'
      });

      // Enemy Generation
      if (width > 150 && Math.random() > 0.5) {
        const enemyWidth = 40;
        const enemyHeight = 40;
        const rand = Math.random();
        
        let type: EnemyEntity['type'] = 'patrol';
        let color = COLORS.ACCENT_DANGER;
        
        if (rand > 0.7) {
            type = 'seeker';
            color = '#FF4500'; // OrangeRed for seekers
        } else if (rand > 0.4) {
            type = 'floater';
            color = '#1E90FF'; // DodgerBlue for floaters
        }

        enemiesRef.current.push({
          id: Date.now() + Math.random(),
          x: platformX + width / 2 - enemyWidth / 2,
          y: y - enemyHeight,
          width: enemyWidth,
          height: enemyHeight,
          vx: type === 'seeker' ? 0 : 2, // Seekers calc velocity dynamically
          patrolStartX: platformX,
          patrolEndX: platformX + width,
          startY: y - enemyHeight - 50, // Float higher
          type: type,
          color: color
        });
      }

      if (width > 80 && Math.random() > 0.4) {
          const coinPattern = Math.random();
          if (coinPattern > 0.5) {
             collectiblesRef.current.push({
                 id: Date.now() + Math.random() + 2000,
                 x: platformX + width/2 - 10,
                 y: y - 60,
                 width: 20, 
                 height: 20,
                 type: 'coin',
                 color: '#FFD700',
                 collected: false
             });
          } else {
             for(let k=0; k<3; k++) {
                 collectiblesRef.current.push({
                     id: Date.now() + Math.random() + 3000 + k,
                     x: platformX + width/2 - 40 + (k * 30),
                     y: y - 60,
                     width: 20, 
                     height: 20,
                     type: 'coin',
                     color: '#FFD700',
                     collected: false
                 });
             }
          }
      }

      if (Math.random() > 0.95) {
         collectiblesRef.current.push({
             id: Date.now() + Math.random() + 5000,
             x: platformX + width/2,
             y: y - 90,
             width: 24, 
             height: 24,
             type: 'health',
             color: '#FF0000',
             collected: false
         });
      }
      
      currentX += gap + width;
    }
  };

  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (gameState === GameState.PLAYING || gameState === GameState.TUTORIAL) {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
            if (playerRef.current.isGrounded) {
                // Normal Jump
                playerRef.current.vy = PHYSICS.JUMP_FORCE;
                playerRef.current.isGrounded = false;
                canJumpRef.current = false;
                doubleJumpAvailableRef.current = true;
                spawnParticles(playerRef.current.x + playerRef.current.width/2, playerRef.current.y + playerRef.current.height, '#90EE90', 5);
            } else if (wallContactRef.current !== 0) {
                // Wall Jump
                playerRef.current.vy = PHYSICS.WALL_JUMP_FORCE.y;
                playerRef.current.vx = -wallContactRef.current * PHYSICS.WALL_JUMP_FORCE.x; // Jump away from wall
                playerRef.current.facing = -wallContactRef.current; // Face away
                spawnParticles(playerRef.current.x + (wallContactRef.current > 0 ? playerRef.current.width : 0), playerRef.current.y + playerRef.current.height/2, '#FFF', 8);
                // Temporarily disable wall stickiness?
                // Double jump remains available if wall jumping
                doubleJumpAvailableRef.current = true;
            } else if (doubleJumpAvailableRef.current) {
                // Double Jump
                playerRef.current.vy = PHYSICS.DOUBLE_JUMP_FORCE;
                doubleJumpAvailableRef.current = false;
                spawnParticles(playerRef.current.x + playerRef.current.width/2, playerRef.current.y + playerRef.current.height, COLORS.ACCENT_ORANGE, 5);
            }
        }

        if ((e.code === 'ShiftLeft' || e.code === 'KeyZ') && dashRef.current.cooldown <= 0 && !dashRef.current.active) {
            dashRef.current.active = true;
            dashRef.current.timer = PHYSICS.DASH_DURATION;
            dashRef.current.cooldown = PHYSICS.DASH_COOLDOWN;
            spawnParticles(playerRef.current.x + playerRef.current.width/2, playerRef.current.y + playerRef.current.height/2, '#00FFFF', 10);
        }
      }

      if (e.code === 'Escape') {
        if (gameState === GameState.PLAYING || gameState === GameState.TUTORIAL) setGameState(GameState.PAUSED);
        else if (gameState === GameState.PAUSED) setGameState(GameState.PLAYING);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') canJumpRef.current = true;
      if (e.code === 'ShiftLeft' || e.code === 'KeyZ') canDashRef.current = true;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, setGameState]);

  const update = useCallback(() => {
    if (gameState !== GameState.PLAYING && gameState !== GameState.TUTORIAL) return;

    frameCountRef.current++;
    const player = playerRef.current;
    
    // Dash Cooldown
    if (dashRef.current.cooldown > 0) dashRef.current.cooldown--;
    if (dashRef.current.active) {
        dashRef.current.timer--;
        // Add trail
        if (frameCountRef.current % 2 === 0) {
            trailRef.current.push({
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                facing: player.facing,
                alpha: 0.6
            });
        }

        if (dashRef.current.timer <= 0) {
            dashRef.current.active = false;
            player.vx = player.facing * PHYSICS.MOVE_SPEED; // Exit dash with momentum
        }
    }

    // Movement Logic
    if (dashRef.current.active) {
        player.vx = player.facing * PHYSICS.DASH_SPEED;
        player.vy = 0; // defy gravity
    } else {
        if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
            player.vx += PHYSICS.MOVE_SPEED;
            player.facing = 1;
        }
        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
            player.vx -= PHYSICS.MOVE_SPEED;
            player.facing = -1;
        }
        player.vx *= PHYSICS.FRICTION;
        
        // Wall Slide Physics
        if (wallContactRef.current !== 0 && player.vy > 0 && !player.isGrounded) {
             player.vy += PHYSICS.GRAVITY * 0.3; // Fall slower
             if (player.vy > PHYSICS.WALL_SLIDE_SPEED) player.vy = PHYSICS.WALL_SLIDE_SPEED;
             // Dust particles
             if (Math.random() > 0.8) {
                 spawnParticles(player.x + (wallContactRef.current > 0 ? player.width : 0), player.y + player.height, '#CCC', 1);
             }
        } else {
             player.vy += PHYSICS.GRAVITY;
        }
    }
    
    player.x += player.vx;
    player.y += player.vy;
    
    // Reset frame-based states
    player.isGrounded = false;
    wallContactRef.current = 0;

    // Boundary Check
    if (player.y > GAME_CONFIG.CANVAS_HEIGHT) {
      if (gameState === GameState.TUTORIAL) {
         player.x = 100;
         player.y = 300;
         player.vx = 0;
         player.vy = 0;
         cameraRef.current.x = 0;
      } else {
         healthRef.current = 0;
         setStats(prev => ({...prev, health: 0}));
         setGameState(GameState.GAME_OVER);
         return;
      }
    }

    // Platform Collisions
    platformsRef.current.forEach(platform => {
      if (
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y < platform.y + platform.height &&
        player.y + player.height > platform.y
      ) {
        if (platform.type === 'jump_pad') {
             // Hit Jump Pad
             if (player.vy > 0) { // Only trigger if falling onto it
                 player.vy = PHYSICS.JUMP_PAD_FORCE;
                 player.isGrounded = false;
                 doubleJumpAvailableRef.current = true;
                 spawnParticles(platform.x + platform.width/2, platform.y, '#FF00FF', 10);
             }
             return;
        }

        if (platform.type === 'hazard') {
            if (dashRef.current.active) return; // Invincible while dashing?

            healthRef.current -= 1;
            setStats(prev => ({...prev, health: healthRef.current}));
             player.vy = -10;
             player.vx = -player.vx * 2;
             spawnParticles(player.x, player.y, COLORS.ACCENT_DANGER, 10);
             if (healthRef.current <= 0) setGameState(GameState.GAME_OVER);
             return;
        } 
        
        if (platform.type === 'finish') {
            setGameState(GameState.MENU);
            alert("Level Completed!");
            return;
        }

        // Standard Collision Resolution
        const prevY = player.y - player.vy;
        
        // Land on top
        if (prevY + player.height <= platform.y + 15 && player.vy >= 0) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.isGrounded = true;
            doubleJumpAvailableRef.current = true;
        } 
        // Ceiling hit
        else if (prevY >= platform.y + platform.height - 15 && player.vy < 0) {
             player.y = platform.y + platform.height;
             player.vy = 0;
        }
        // Side hit (Wall)
        else {
             // Determine side
             const prevX = player.x - player.vx;
             // If was to the left
             if (prevX + player.width <= platform.x + 10) {
                 player.x = platform.x - player.width;
                 player.vx = 0;
                 wallContactRef.current = -1; // Wall is to the Right? No, wallContact convention: 1 for wall on Right, -1 for wall on Left
                 // Let's fix convention: 
                 // If platform is to my right, wallContact = 1.
                 wallContactRef.current = 1;
             }
             // If was to the right
             else if (prevX >= platform.x + platform.width - 10) {
                 player.x = platform.x + platform.width;
                 player.vx = 0;
                 wallContactRef.current = -1;
             }
        }
      }
    });

    // Enemy Updates
    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const enemy = enemiesRef.current[i];
      
      // Enemy AI
      if (enemy.type === 'patrol') {
          enemy.x += enemy.vx;
          if (enemy.x <= enemy.patrolStartX || enemy.x + enemy.width >= enemy.patrolEndX) {
            enemy.vx *= -1;
          }
      } else if (enemy.type === 'seeker') {
          const dist = player.x - enemy.x;
          if (Math.abs(dist) < 400) {
              enemy.vx = dist > 0 ? 3 : -3;
          } else {
              enemy.vx = 0; // Idle if far
          }
          enemy.x += enemy.vx;
      } else if (enemy.type === 'floater') {
          // Floating pattern
          enemy.x += enemy.vx;
          if (enemy.x <= enemy.patrolStartX || enemy.x + enemy.width >= enemy.patrolEndX) {
              enemy.vx *= -1;
          }
          if (enemy.startY) {
              enemy.y = enemy.startY + Math.sin(frameCountRef.current * 0.05) * 50;
          }
      }

      // Cleanup
      if (enemy.x + enemy.width < cameraRef.current.x - 200) {
        enemiesRef.current.splice(i, 1);
        continue;
      }

      // Enemy Collision
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        const isStomp = player.vy > 0 && (player.y + player.height) < (enemy.y + enemy.height / 2 + 10);
        const isDashAttack = dashRef.current.active;

        if (isStomp || isDashAttack) {
          enemiesRef.current.splice(i, 1);
          if (isStomp) player.vy = -10;
          spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, COLORS.ACCENT_DANGER, 15);
          scoreRef.current += 10;
        } else {
          healthRef.current -= 1;
          setStats(prev => ({...prev, health: healthRef.current}));
          player.vy = -8;
          player.vx = player.x < enemy.x ? 10 : -10;
          spawnParticles(player.x + player.width/2, player.y + player.height/2, '#FF0000', 10);

          if (healthRef.current <= 0 && gameState !== GameState.TUTORIAL) setGameState(GameState.GAME_OVER);
        }
      }
    }

    // Collectibles & Other Updates (Keep existing logic)
    for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
        const c = collectiblesRef.current[i];
        if (c.x + c.width < cameraRef.current.x - 200) {
            collectiblesRef.current.splice(i, 1);
            continue;
        }

        if (
            !c.collected &&
            player.x < c.x + c.width &&
            player.x + player.width > c.x &&
            player.y < c.y + c.height &&
            player.y + player.height > c.y
        ) {
            c.collected = true;
            if (c.type === 'coin') {
                setStats(prev => ({ ...prev, coins: prev.coins + 1 }));
                spawnParticles(c.x + c.width/2, c.y + c.height/2, '#FFD700', 6);
                collectiblesRef.current.splice(i, 1);
            } else if (c.type === 'health') {
                if (healthRef.current < maxHealthRef.current) {
                    healthRef.current = Math.min(healthRef.current + 1, maxHealthRef.current);
                    setStats(prev => ({ ...prev, health: healthRef.current }));
                    spawnParticles(c.x + c.width/2, c.y + c.height/2, '#FF0000', 10);
                } else {
                    spawnParticles(c.x + c.width/2, c.y + c.height/2, '#FFFFFF', 5);
                }
                collectiblesRef.current.splice(i, 1);
            }
        }
    }

    const targetCamX = player.x - 200;
    cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.1;

    if (gameState === GameState.PLAYING) {
        const lastPlatform = platformsRef.current[platformsRef.current.length - 1];
        if (lastPlatform.x < cameraRef.current.x + GAME_CONFIG.CANVAS_WIDTH + 200) {
            generateChunk(lastPlatform.x + lastPlatform.width);
        }
        if (platformsRef.current.length > 50) {
            platformsRef.current = platformsRef.current.filter(p => p.x + p.width > cameraRef.current.x - 200);
        }
        
        const dist = Math.floor(player.x / 100);
        if (dist > scoreRef.current) {
            scoreRef.current = dist;
            if (scoreRef.current % 5 === 0) setStats(prev => ({ ...prev, distance: scoreRef.current }));
        }

        if (scoreRef.current > 0 && scoreRef.current % 500 === 0) setGameState(GameState.LEVEL_TRANSITION);
    } else if (gameState === GameState.TUTORIAL) {
        if (player.x < 600) setTutorialText("Arrow Keys / WASD to Move");
        else if (player.x < 1200) setTutorialText("Space / Up to Jump");
        else if (player.x < 1800) setTutorialText("Press Jump in air to Double Jump");
        else if (player.x < 2800) setTutorialText("Press Shift or Z to Dash!");
        else if (player.x < 3300) setTutorialText("Hold against wall & Jump to Wall Jump!");
        else if (player.x < 3800) setTutorialText("Bounce on Jump Pads!");
        else setTutorialText("Reach the wall to finish!");
    }

    // Trail Decay
    for (let i = trailRef.current.length - 1; i >= 0; i--) {
        trailRef.current[i].alpha -= 0.05;
        if (trailRef.current[i].alpha <= 0) trailRef.current.splice(i, 1);
    }

    particlesRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) particlesRef.current.splice(index, 1);
    });

  }, [gameState, setGameState, setStats]);

  // DRAW FUNCTIONS
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, camX: number) => {
      // Sky Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F7FA');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(width - 100, 80, 40, 0, Math.PI * 2);
      ctx.fill();

      // Parallax Layer 1 (Far Hills)
      ctx.fillStyle = '#A3D9A5'; // Light green mist
      const parallax1 = camX * 0.2;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = -200; x < width + 200; x += 300) {
          const offsetX = (x - parallax1 % 300);
          ctx.lineTo(offsetX, height - 250);
          ctx.lineTo(offsetX + 150, height);
      }
      ctx.fill();

      // Parallax Layer 2 (Jungle Silhouettes)
      ctx.fillStyle = '#2E8B57'; // SeaGreen
      const parallax2 = camX * 0.5;
      ctx.beginPath();
      for (let x = -100; x < width + 100; x += 150) {
          const offsetX = (x - parallax2 % 150);
          // Draw simple tree shapes
          ctx.fillRect(offsetX + 60, height - 200, 20, 200);
          ctx.beginPath();
          ctx.arc(offsetX + 70, height - 220, 50, 0, Math.PI * 2);
          ctx.fill();
      }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, p: PlayerEntity, alpha: number = 1.0) => {
      const isDashing = dashRef.current.active;
      
      // Save context
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      ctx.scale(p.facing, 1); // Flip based on direction
      
      if (isDashing && alpha === 1.0) {
          // Blur effect
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(-10, 0, 25, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
      }

      // Tail
      ctx.fillStyle = alpha < 1.0 ? `rgba(126, 211, 33, ${alpha})` : COLORS.PRIMARY_GREEN;
      ctx.beginPath();
      ctx.moveTo(-15, 5);
      ctx.quadraticCurveTo(-35, 10, -30, -5);
      ctx.lineTo(-15, 0);
      ctx.fill();

      // Body (Gecko shape)
      ctx.fillStyle = alpha < 1.0 ? `rgba(126, 211, 33, ${alpha})` : COLORS.PRIMARY_GREEN;
      ctx.beginPath();
      ctx.ellipse(0, 5, 20, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(10, -10, 14, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(14, -12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(16, -12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      const walkCycle = alpha < 1.0 ? 0 : Math.sin(frameCountRef.current * 0.5) * 5;
      ctx.fillStyle = '#558B2F'; // Darker green
      ctx.beginPath();
      ctx.arc(-10 + walkCycle, 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(10 - walkCycle, 18, 5, 0, Math.PI * 2);
      ctx.fill();

      // Belly patch
      ctx.fillStyle = '#C5E1A5';
      ctx.beginPath();
      ctx.ellipse(0, 8, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, e: EnemyEntity) => {
      ctx.save();
      ctx.translate(e.x + e.width/2, e.y + e.height/2);
      
      if (e.type === 'patrol') {
        // Spiky Body
        ctx.fillStyle = COLORS.ACCENT_DANGER;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        // Spikes
        for(let i=0; i<8; i++) {
            const angle = (Math.PI * 2 / 8) * i + (frameCountRef.current * 0.05);
            const sx = Math.cos(angle) * 24;
            const sy = Math.sin(angle) * 24;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle - 0.2) * 16, Math.sin(angle - 0.2) * 16);
            ctx.lineTo(sx, sy);
            ctx.lineTo(Math.cos(angle + 0.2) * 16, Math.sin(angle + 0.2) * 16);
            ctx.fill();
        }
      } else if (e.type === 'seeker') {
          // Seeker (Fast, aerodynamic)
          ctx.fillStyle = '#FF4500';
          ctx.scale(e.vx > 0 ? 1 : -1, 1);
          ctx.beginPath();
          ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          // Horn
          ctx.beginPath();
          ctx.moveTo(10, -5);
          ctx.lineTo(25, 0);
          ctx.lineTo(10, 5);
          ctx.fill();
          // Eye
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(10, -2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(12, -2, 2, 0, Math.PI * 2);
          ctx.fill();
      } else if (e.type === 'floater') {
          // Floater (Jellyfish-like)
          ctx.fillStyle = '#1E90FF';
          ctx.beginPath();
          ctx.arc(0, -5, 18, Math.PI, 0); // Semi circle top
          ctx.lineTo(18, 5);
          ctx.bezierCurveTo(10, 15, -10, 15, -18, 5);
          ctx.fill();
          // Tentacles
          ctx.strokeStyle = '#1E90FF';
          ctx.lineWidth = 2;
          for(let i=-10; i<=10; i+=10) {
              ctx.beginPath();
              ctx.moveTo(i, 5);
              ctx.quadraticCurveTo(i + Math.sin(frameCountRef.current * 0.2)*5, 15, i, 25);
              ctx.stroke();
          }
      }

      // Angry Eyes (Common if not overridden)
      if (e.type === 'patrol') {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(-2, 2);
        ctx.lineTo(-10, 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(10, -5);
        ctx.lineTo(2, 2);
        ctx.lineTo(10, 5);
        ctx.fill();
      }

      ctx.restore();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Dynamic Background
    drawBackground(ctx, canvas.width, canvas.height, cameraRef.current.x);

    // Transform Camera
    ctx.save();
    ctx.translate(-cameraRef.current.x, 0);

    // Draw Platforms
    platformsRef.current.forEach(p => {
      if (p.type === 'finish') {
          // Checkered Finish Line
          ctx.fillStyle = '#FFF';
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.fillStyle = '#000';
          for(let r=0; r<p.height/20; r++) {
              for(let c=0; c<p.width/20; c++) {
                  if((r+c)%2===0) ctx.fillRect(p.x + c*20, p.y + r*20, 20, 20);
              }
          }
      } else if (p.type === 'jump_pad') {
          // Draw Jump Pad (Trampoline)
          ctx.fillStyle = '#555'; // Base
          ctx.fillRect(p.x + 5, p.y + 15, p.width - 10, p.height - 15);
          // Pad
          ctx.fillStyle = '#FF00FF'; // Neon pink pad
          ctx.beginPath();
          ctx.ellipse(p.x + p.width/2, p.y + 10, p.width/2 - 2, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.stroke();
      } else {
        // Main Block
        ctx.fillStyle = COLORS.SECONDARY_BROWN;
        ctx.fillRect(p.x, p.y + 10, p.width, p.height - 10);
        
        // Grass Top
        if (p.type === 'hazard') {
             ctx.fillStyle = '#555'; // Grey spikes base
             ctx.fillRect(p.x, p.y + 10, p.width, p.height - 10);
             // Spikes
             ctx.fillStyle = COLORS.ACCENT_DANGER;
             for(let i=0; i<p.width; i+=20) {
                 ctx.beginPath();
                 ctx.moveTo(p.x + i, p.y + 10);
                 ctx.lineTo(p.x + i + 10, p.y - 10); // Pointy top
                 ctx.lineTo(p.x + i + 20, p.y + 10);
                 ctx.fill();
             }
        } else {
            // Grass Layer
            ctx.fillStyle = '#7CB342';
            ctx.fillRect(p.x, p.y, p.width, 10);
            // Overhangs
            ctx.fillStyle = '#558B2F';
            ctx.fillRect(p.x, p.y+10, p.width, 4); 
            
            // Texture
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            for(let i=0; i<5; i++) {
                const tx = p.x + (Math.abs(Math.sin(p.id * i)) * p.width);
                const ty = p.y + 15 + (Math.abs(Math.cos(p.id * i)) * (p.height - 20));
                ctx.beginPath();
                ctx.arc(tx, ty, 3, 0, Math.PI*2);
                ctx.fill();
            }
        }
      }
    });

    // Draw Collectibles
    collectiblesRef.current.forEach(c => {
        const floatY = Math.sin(Date.now() / 200) * 5;
        if (c.type === 'coin') {
            // Coin Glow
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(c.x + c.width/2, c.y + c.height/2 + floatY, c.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Shine
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(c.x + c.width/2 - 3, c.y + c.height/2 + floatY - 3, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (c.type === 'health') {
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#FF0000';
            // Heart shape
            const hx = c.x + c.width/2;
            const hy = c.y + c.height/2 + floatY;
            ctx.beginPath();
            ctx.moveTo(hx, hy + 8);
            ctx.bezierCurveTo(hx - 8, hy, hx - 8, hy - 8, hx, hy - 8);
            ctx.bezierCurveTo(hx + 8, hy - 8, hx + 8, hy, hx, hy + 8);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });

    // Draw Enemies
    enemiesRef.current.forEach(e => drawEnemy(ctx, e));

    // Draw Trails (Ghost effect)
    trailRef.current.forEach(t => {
        // Mock a player entity from trail data
        const ghost: PlayerEntity = {
            ...playerRef.current,
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
            facing: t.facing
        };
        drawPlayer(ctx, ghost, t.alpha);
    });

    // Draw Player
    drawPlayer(ctx, playerRef.current);

    // Draw Particles
    particlesRef.current.forEach(pt => {
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3 + Math.random()*2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    ctx.restore();

  }, [gameState]);

  const loop = useCallback(() => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(loop);
  }, [update, draw]);

  useEffect(() => {
    if (gameState === GameState.PLAYING || gameState === GameState.LEVEL_TRANSITION || gameState === GameState.TUTORIAL) {
        requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop, gameState]);

  useEffect(() => {
      if (stats.distance === 0 && stats.score === 0 && stats.level === 1 && gameState !== GameState.TUTORIAL) {
          initLevel();
      }
      if (gameState === GameState.TUTORIAL) {
          initLevel();
      }
  }, [stats.distance, stats.score, stats.level, gameState, initLevel]);

  useEffect(() => {
      initLevel();
  }, []);

  return (
    <div className="relative w-full h-full">
        <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="block w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }} 
        />
        {gameState === GameState.TUTORIAL && tutorialText && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/70 px-8 py-4 rounded-full border-2 border-white animate-bounce">
                <h3 className="text-2xl text-[#7ED321] font-[Luckiest_Guy] tracking-wide text-center shadow-black drop-shadow-md">
                    {tutorialText}
                </h3>
            </div>
        )}
    </div>
  );
};

export default GameCanvas;
