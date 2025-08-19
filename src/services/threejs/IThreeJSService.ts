export interface IThreeJSService {
  updateCharacterPosition(steps: number): void;
  resetScene(): void;
  setAnimationState(isWalking: boolean): void;
}