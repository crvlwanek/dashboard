export type VolumeResponse = {
  id: string
  volumeInfo: {
    title: string
    authors: string[]
    publisher: string
    /** Date string */
    publishedDate: string
    description: string
    /** Integer */
    pageCount: number
    imageLinks: {
      thumbnail: string
    }
    previewLink: string
  }
}

export default class GoogleBooks {
  private static readonly _baseURL = "https://www.googleapis.com/books/v1"

  /** https://developers.google.com/books/docs/v1/reference/volumes/get */
  public static async getVolume(volumeId: string) {
    const response = await fetch(`${this._baseURL}/volumes/${volumeId}`)
    return (await response.json()) as VolumeResponse
  }
}
