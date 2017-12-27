import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MoovieProvider } from '../../providers/moovie/moovie';
import { FilmeDetalhePage } from '../filme-detalhe/filme-detalhe';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [
    MoovieProvider
  ]
})
export class FeedPage {
  public objeto_feed={
    titulo: "Lucas Codificando",
    data: "November 5, 1955",
    descricao:"Criação d App",
    qtde_likes: 12,
    qtde_comment: 4,
    time_comment : "11h ago"
  };

  public  lista_filmes = new Array<any>();
  public page =1;
  public loader;
  public refresher;
  public isRefreshing: boolean = false;
  public infiniteScroll;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private movieprovider: MoovieProvider,
    public loadingCtrl: LoadingController
    ) {
  }

  //Loading
  abreCarregando() {
     this.loader = this.loadingCtrl.create({
      content: "Carreando Filmes..."
    });
    this.loader.present();
  }

    //Loading
  fechaCarregando(){
    this.loader.dismiss();
  }


  //Refresh na pagina
  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;
    this.carregandoFilmes();
  }

  ionViewDidEnter() {
   this.carregandoFilmes()
  }

  abrirDetalhes(filme){
    console.log(filme);
    this.navCtrl.push(FilmeDetalhePage, {id: filme.id});
  }

  doInfinite(infiniteScroll) {
    this.page++;
   this.infiniteScroll = infiniteScroll;
   this.carregandoFilmes(true);
  }

  carregandoFilmes(newPage:boolean =false){
    this.abreCarregando();
    this.movieprovider.getLatesMovies(this.page).subscribe(
      data=>{
        const response = (data as any);
        const objeto_retorno = JSON.parse(response._body);

        if(newPage){
         this.lista_filmes = this.lista_filmes.concat(objeto_retorno.results);
         console.log(this.page);
         console.log(this.lista_filmes);
         this.infiniteScroll.complete();
        }else{
          this.lista_filmes = objeto_retorno.results;
        }

        this.fechaCarregando();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing = false;
        }
      },error=>{
        console.log(error);
        this.fechaCarregando();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing = false;          
        }
      }
     )
  }

}
