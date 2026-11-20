// Espace global du site (provisoire : sera remplacé par des types précis).
interface MApi {
  [key: string]: any;
}
interface Window {
  M: MApi;
}
