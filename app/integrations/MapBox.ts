const apiKey = process.env.MAPBOX_TOKEN
if (!apiKey) {
  throw new Error("MapBox API key is missing")
}

export default class MapBox {
  private static readonly _urlBase = "https://api.mapbox.com/styles/v1/mapbox/"

  private static _urlEncode(polyline: string): string {
    return encodeURIComponent(polyline)
  }

  public static async getStaticImageGeoJson(geoJson: any) {
    const style_id = "streets-v12"
    const overlay = `geojson(${JSON.stringify(geoJson)})`
    const height = 600
    const width = 800
    const padding = "50,50,50,50"

    const url = `${this._urlBase}${style_id}/static/${overlay}/auto/${width}x${height}?padding=${padding}&access_token=${apiKey}`

    const response = await fetch(url)

    return response
  }

  public static async getStaticImage(polyline: string) {
    const style_id = "streets-v12"
    const overlay = `path-2+f94c05(${this._urlEncode(polyline)})`
    const height = 400
    const width = 400

    const url = `${this._urlBase}${style_id}/static/${overlay}/auto/${width}x${height}?access_token=${apiKey}`

    const response = await fetch(url)

    return response
  }
}
