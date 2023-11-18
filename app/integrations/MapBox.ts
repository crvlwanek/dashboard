export default class MapBox {
  private _apiKey: string;

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error("Mapbox API key not found");
    }
    this._apiKey = apiKey;
  }

  public async getStaticImage(polyline: string) {
    const style_id = "streets-v12";
    const overlay = `path-2+ff7b00(${encodeURIComponent(polyline)})`;
    const height = 400;
    const width = 400;

    const url = `https://api.mapbox.com/styles/v1/mapbox/${style_id}/static/${overlay}/auto/${width}x${height}?access_token=${this._apiKey}`;

    const response = await fetch(url);

    return response;
  }
}
