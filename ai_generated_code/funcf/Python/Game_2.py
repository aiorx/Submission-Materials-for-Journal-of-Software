```python
def render(self, keys: dict[str, bool] | None = None):
    """
    To be completely honest, this whole method was Composed with basic coding tools.
    It's in no way a critical part of the project, it doesn't really matter,
    and I am not brave enough to handle GUI engineering if I don't have to.
    """
    if not self.gui:
        return

    # configurable parameters
    PARTICLE_SPEED_PX = 1000      # max particle speed in px/s
    PARTICLE_HALF_LIFE = .2     # seconds
    STREAM_INSET_FACTOR = 0.85    # fraction of lx to inset stream origins (centered)
    PARTICLES_PER_THRUST = 5     # spawn count per update

    # Initialize particle system
    if not hasattr(self, 'particles'):
        self.particles = []  # each: {'x','y','vx','vy','age','lifespan'}

    # Background and grid
    self.screen.fill((15, 15, 35))
    ppm = self.pixels_per_metre * 2.5
    spacing = ppm  # 1m
    w, h = self.screen.get_size(); cx, cy = w//2, h//2
    off_x = (-self.env.drone_position[0]*ppm) % spacing
    off_y = ( self.env.drone_position[1]*ppm) % spacing
    for x in np.arange(-spacing+off_x, w, spacing): pygame.draw.line(self.screen, (40,40,60),(x,0),(x,h))
    for y in np.arange(-spacing+off_y, h, spacing): pygame.draw.line(self.screen, (40,40,60),(0,y),(w,y))

    # Draw drone
    angle = self.env.drone_angle; ca, sa = np.cos(angle), np.sin(angle)
    hw, hh = self.env.drone.x_length/2, self.env.drone.y_length/2
    corners = [(-hw,-hh),( hw,-hh),( hw, hh),(-hw, hh)]
    pts = [(cx + (x*ca - y*sa)*ppm, cy - (x*sa + y*ca)*ppm) for x,y in corners]
    pygame.draw.polygon(self.screen,(220,220,220),pts)
    pygame.draw.aalines(self.screen,(255,255,255),True,pts)

    # Update and draw particles
    alive = []
    for p in self.particles:
        p['age'] += self.dt
        if p['age'] < p['lifespan']:
            p['x'] += p['vx'] * self.dt
            p['y'] += p['vy'] * self.dt
            pygame.draw.rect(self.screen, (255,255,255), (int(p['x']), int(p['y']), 2, 2))
            alive.append(p)
    self.particles = alive

    # Spawn new particles under each propeller
    decay_scale = PARTICLE_HALF_LIFE / np.log(2)
    for (lx,ly), sp in [(self.env.drone.L_xy, self.env.drone.L_speed), (self.env.drone.R_xy, self.env.drone.R_speed)]:
        thrust = max(0.0, min(1.0, sp))
        if thrust > 0.1:
            inset = lx * STREAM_INSET_FACTOR
            ox = cx + (inset*ca - ly*sa)*ppm
            oy = cy - (inset*sa + ly*ca)*ppm
            for _ in range(int(thrust * PARTICLES_PER_THRUST)):
                # slight lateral jitter
                jitter = (np.random.rand() - 0.5) * (self.env.drone.x_length * ppm * 0.1)
                px = ox + jitter * ca
                py = oy - jitter * sa
                # downward-only velocity
                angle_off = (np.random.rand() - 0.5) * 0.1
                mag = thrust * PARTICLE_SPEED_PX
                local_vx = mag * np.sin(angle_off)
                local_vy = mag * np.cos(angle_off)
                # world velocities (Pygame y downward positive)
                rvx = local_vx * ca + local_vy * sa
                rvy = local_vx * -sa + local_vy * ca
                lifespan = np.random.exponential(decay_scale)
                self.particles.append({'x': px, 'y': py, 'vx': rvx, 'vy': rvy, 'age': 0.0, 'lifespan': lifespan})

    # Orientation arrow
    ah, ab = 0.1, 0.05; base = hh + 0.05
    arrow = [(-ab,base),(0,base+ah),(ab,base)]
    tri = [(cx + (x*ca - y*sa)*ppm, cy - (x*sa + y*ca)*ppm) for x,y in arrow]
    pygame.draw.polygon(self.screen,(255,100,100),tri)

            # Wind & Rain vectors and static labels
    origin, sv = (w-140,80), 40
    wx = getattr(self.env,'wind_vx',0); ry = getattr(self.env,'rain_vy',0)
    wend = (origin[0]+wx*sv, origin[1]); rend = (origin[0], origin[1]-ry*sv)
    pygame.draw.line(self.screen,(255,50,50),origin,wend,2)
    pygame.draw.line(self.screen,(50,150,255),origin,rend,2)
    pygame.draw.line(self.screen,(255,255,255),origin,(wend[0],rend[1]),2)
    pygame.draw.circle(self.screen,(200,200,200),origin,3)
    # Static labels for wind and rain
    label_x = w - 200
    wind_label = self.font.render(f"Wind: {wx:.2f} m/s", True, (255,50,50))
    rain_label = self.font.render(f"Rain: {ry:.2f} m/s", True, (50,150,255))
    self.screen.blit(wind_label, (label_x, 20))
    self.screen.blit(rain_label, (label_x, 40))

    # Thruster bars 0→1 0→1
    bw,bh = 220,14
    for i, sp in enumerate([self.env.drone.L_speed,self.env.drone.R_speed]):
        thrust = max(0.0, min(1.0, sp))
        x0 = cx - bw - 15 + i*(bw+30); y0 = h - bh - 30
        pygame.draw.rect(self.screen, (60,60,80), (x0,y0,bw,bh))
        pygame.draw.rect(self.screen, (0,200,255), (x0,y0,int(bw*thrust),bh))
        pygame.draw.rect(self.screen, (255,255,255), (x0,y0,bw,bh), 1)
        label = "Left thrust:" if i==0 else "Right thrust:"
        txt = self.font.render(f"{label} {thrust:.2f}", True, (230,230,230))
        self.screen.blit(txt, (x0, y0 - txt.get_height() - 5))

    # WASD layout
    if keys:
        ksz, m = 40, 8; bx, by = 20, h - ksz - 20
        pos = {'A':(bx,by),'S':(bx+ksz+m,by),'D':(bx+2*(ksz+m),by),'W':(bx+ksz+m,by-ksz-m)}
        for k,p in pos.items():
            if k in keys:
                col = (240,240,240) if keys[k] else (80,80,100)
                pygame.draw.rect(self.screen,col,(p[0],p[1],ksz,ksz),border_radius=5)
                tk = self.font.render(k,True,(20,20,30))
                self.screen.blit(tk,(p[0]+(ksz-tk.get_width())/2,p[1]+(ksz-tk.get_height())/2))

    # Telemetry
    pw,ph = 280,180; panel = pygame.Surface((pw,ph),pygame.SRCALPHA)
    panel.fill((25,25,45,220)); self.screen.blit(panel,(20,20))
    fields = [("Position",f"({self.env.drone_position[0]:.2f},{self.env.drone_position[1]:.2f}) m"),
              ("Angle",f"{np.degrees(self.env.drone_angle):.1f}°"),
              ("Vx",f"{self.env.drone_velocity[0]:.2f} m/s"),("Vy",f"{self.env.drone_velocity[1]:.2f} m/s"),
              ("Wind",f"{wx:.2f} m/s"),("Rain",f"{ry:.2f} m/s")]
    total_h = sum(self.font.size(f"{L}: {V}")[1]+6 for L,V in fields)
    sy = 20 + (ph - total_h)/2
    for L,V in fields:
        t = self.font.render(f"{L}: {V}",True,(245,245,245)); self.screen.blit(t,(30,sy)); sy+=t.get_height()+6

    pygame.display.flip(); self.clock.tick(1/self.dt)
```