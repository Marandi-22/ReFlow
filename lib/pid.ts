// PID Controller for DO (Dissolved Oxygen) control

export class PIDController {
  private Kp: number;
  private Ki: number;
  private Kd: number;
  private integral: number = 0;
  private lastError: number = 0;
  private integralMax: number = 50;
  private integralMin: number = -50;

  constructor(Kp: number, Ki: number, Kd: number) {
    this.Kp = Kp;
    this.Ki = Ki;
    this.Kd = Kd;
  }

  /**
   * Calculate PID output
   * @param setpoint Target value
   * @param current Current value
   * @param dt Time delta in seconds
   * @returns Control output (0-100 for blower speed)
   */
  calculate(setpoint: number, current: number, dt: number): number {
    const error = setpoint - current;

    // Integral term with anti-windup
    this.integral += error * dt;
    this.integral = Math.max(this.integralMin, Math.min(this.integralMax, this.integral));

    // Derivative term
    const derivative = dt > 0 ? (error - this.lastError) / dt : 0;

    // PID output
    const output = this.Kp * error + this.Ki * this.integral + this.Kd * derivative;

    // Update last error
    this.lastError = error;

    // Clamp output to 0-100 (blower speed percentage)
    return Math.max(0, Math.min(100, output));
  }

  /**
   * Get current PID state
   */
  getState() {
    return {
      P: this.Kp,
      I: this.Ki,
      D: this.Kd,
      error: this.lastError,
      integral: this.integral,
      derivative: 0,
      lastError: this.lastError,
    };
  }

  /**
   * Reset PID controller state
   */
  reset() {
    this.integral = 0;
    this.lastError = 0;
  }

  /**
   * Update PID parameters
   */
  setParameters(Kp: number, Ki: number, Kd: number) {
    this.Kp = Kp;
    this.Ki = Ki;
    this.Kd = Kd;
  }
}
