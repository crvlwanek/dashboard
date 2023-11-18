export default class Pantry<T> {
  private _pantryId: string;
  private _basketName: string;

  private readonly _urlBase: string = "https://getpantry.cloud/apiv1/pantry";

  public constructor(pantryId?: string, basketName?: string) {
    if (!pantryId || !basketName) {
      throw new Error("API key and or basket name not found");
    }

    this._pantryId = pantryId;
    this._basketName = basketName;
  }

  private _getURL = (): string =>
    `${this._urlBase}/${this._pantryId}/basket/${this._basketName}`;

  public async get(): Promise<T> {
    const url = this._getURL();
    const response = await fetch(url);
    return response.json();
  }

  public async put(data: T): Promise<T> {
    const url = this._getURL();
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  }
}
