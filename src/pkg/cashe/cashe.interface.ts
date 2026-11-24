export interface ICasheProvider {
    get(key: string): Promise <string |  null >; 
    set (key: string, value:any , ttl: number ) : Promise<void>;
    del (key: string) : Promise <number>; 
    ttl (key: string): Promise <number>
}