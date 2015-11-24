import { StreamsAttribute, Stream, Signal} from '../../../app/typings/types';

export class PublicApi {
  private static BASE_URL: string = "https://dc3r5gsogb.execute-api.us-west-2.amazonaws.com/dev";
  streams: Array<Stream>;
  signalsMap = new Map<String, Array<Signal>>();
  

  /** @ngInject */
  constructor(private $http: angular.IHttpService, private $q: angular.IQService, private _: _.LoDashStatic) { }
  
  allStreams(): angular.IPromise<Array<Stream>> {
    let deferred = this.$q.defer();

    if (typeof this.streams !== 'undefined') {
      // the variable is defined
      console.log('PublicApiService - get already fatched streams: ' + this.streams);
      deferred.resolve(this.streams);
    }
    else {
      console.log('PublicApiService - fatches streams');
      this.$http.get(PublicApi.BASE_URL + '/streams').then(
        (res: angular.IHttpPromiseCallbackArg<Array<Stream>>) => {
          this.streams = res.data;
          deferred.resolve(this.streams);
        },
        (err) => {
          console.error('PublicApiService - Could not get streams. Error: ' + err);
          deferred.reject('PublicApiService - Could not get streams. Error: ' + err);
        })
    }
    return deferred.promise;
  }

  stream(streamId: string): angular.IPromise<Stream> {
    let deferred = this.$q.defer();
    if (typeof this.streams !== 'undefined') {
      // the variable is defined
      console.log('PublicApiService - get already fatched streams: ' + this.streams);
      deferred.resolve(_.find(this.streams, (stream: Stream) => stream.id === streamId));
    }
    else {
      this.allStreams().then((streams: Array<Stream>) => {
        deferred.resolve(_.find(this.streams, (stream: Stream) => stream.id === streamId));
      })
    }
    return deferred.promise;
  }

  signals(streamId: string): angular.IPromise<Array<Signal>> {
    
    let deferred = this.$q.defer();
    
    if (typeof this.signalsMap[streamId] !== 'undefined') {
      // the variable is defined
      console.log('PublicApiService - get already fatched signals: ' + this.signalsMap[streamId]);
      deferred.resolve(this.signalsMap[streamId]);
    }
    else {
      console.log('PublicApiService - fatches signals');
      this.$http.get(PublicApi.BASE_URL + '/streams/' + streamId + '/signals').then(
        (res: angular.IHttpPromiseCallbackArg<Array<Signal>>) => {
          this.signalsMap[streamId] = res.data;
          deferred.resolve(this.signalsMap[streamId]);
        },
        (err) => {
          console.error('PublicApiService - Could not get signals. Error: ' + err);
          deferred.reject('PublicApiService - Could not get signals. Error: ' + err);
        })
    }

    return deferred.promise;
  }
}
