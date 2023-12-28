import polyline from "@mapbox/polyline"
import env from "~/utilities/env"

const apiKey = env.get("MAPBOX_TOKEN")

type MapBoxStaticAPIArgs = {
  height: number
  width: number
  /** Color for the stroke, must be in hex format */
  stroke: string
  strokeWidth: number
  /** Comma delimited string of top,right,bottom,left padding values */
  padding?: string
}

type GeoJsonArgs = Pick<MapBoxStaticAPIArgs, "stroke"> & Pick<MapBoxStaticAPIArgs, "strokeWidth">

export default class MapBox {
  private static readonly _urlBase = "https://api.mapbox.com/styles/v1/mapbox/"

  private static _urlEncode(polyline: string): string {
    return encodeURIComponent(polyline)
  }
  //fc4c02
  public static polylineToGeoJson(line: string, args: GeoJsonArgs) {
    const { stroke, strokeWidth } = args
    // Style spec https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { stroke: encodeURIComponent(stroke), "stroke-width": strokeWidth },
          geometry: polyline.toGeoJSON(line),
        },
      ],
    }
  }

  public static getStaticImageGeoJson(line: string, args: MapBoxStaticAPIArgs): string {
    const { stroke, strokeWidth, height, width, padding } = args
    const geoJson = this.polylineToGeoJson(line, { stroke, strokeWidth })

    const style_id = "outdoors-v12"
    const overlay = `geojson(${JSON.stringify(geoJson)})`

    const url = new URL(`${this._urlBase}${style_id}/static/${overlay}/auto/${width}x${height}`)
    if (padding) {
      url.searchParams.set("padding", padding)
    }
    url.searchParams.set("access_token", apiKey!)
    return url.href
  }

  public static async getStaticImage(polyline: string) {
    const style_id = "outdoors-v12"
    const overlay = `path-2+f94c05(${this._urlEncode(polyline)})`
    const height = 400
    const width = 400

    const url = `${this._urlBase}${style_id}/static/${overlay}/auto/${width}x${height}?access_token=${apiKey}`

    const response = await fetch(url)

    return response
  }
}
