export abstract class AbstractCrudService {
    constructor(
        private httpClient: HttpClient
      ) { }
    
      getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>('/api/users')
      }
      addUser(user: User): Observable<object> {
        return this.httpClient.post('/api/users', user)
      }
      deleteUser(user: User) {
        return this.httpClient.delete(`api/users/${user._id}`)
      }
      updateUser(user: Partial<User>) {
        return this.httpClient.patch(`/api/users/${user._id}`, user)
      }
    
    
      getProducts(): Observable<Product[]> {
        return this.httpClient.get<Product[]>('/api/products')
      }
      addProduct(product: Product): Observable<object> {
        return this.httpClient.post('/api/products', product)
      }
      deleteProduct(product: Product) {
        return this.httpClient.delete(`api/products/${product._id}`)
      }
      updateProduct(product: Partial<Product>) {
        return this.httpClient.patch(`/api/products/${product._id}`, product)
      }
    
    
      getPrinters(): Observable<Printer[]> {
        return this.httpClient.get<Printer[]>('/api/printers')
      }
      addPrinter(printer: Printer): Observable<object> {
        return this.httpClient.post('/api/printers', printer)
      }
      deletePrinter(printer: Printer) {
        return this.httpClient.delete(`api/printers/${printer._id}`)
      }
      updatePrinter(printer: Partial<Printer>) {
        return this.httpClient.patch(`/api/printers/${printer._id}`, printer)
      }
      print(printer: Printer, order: Order) {
        return this.httpClient.post(`api/printers/print/${printer._id}`, order)
      }
    
      
      getSettings(): Observable<Settings> {
        return this.httpClient.get<Settings>('/api/settings')
      }
}