import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsServicesService {

  private _tagHistory: string[] = [];
  private apikey: string = "N8segJHx4XezJ8U2f0Ma13fPMQIDoIA6";
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  public gifList: Gif[] = [];

  constructor(private http: HttpClient) { }

  get tagsHistory() {
    return [...this._tagHistory]
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    /* Si el tag nuevo coincide con alguno anterior elimino el anterior */
    if (this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);

  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe(resp => {

        this.gifList = resp.data;
        console.log({ gifs: this.gifList })

      });
  }
}

