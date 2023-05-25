export const EVENT_ITEM_COLORS = ['#157F1F', '#FF4242', '#FB62F6', '#2E4057', '#4C2E05'] as const;

export function generateRandomKey() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}_${randomNum}`;
}
