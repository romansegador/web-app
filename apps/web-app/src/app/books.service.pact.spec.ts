import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BooksService } from './books.service';
import { Book } from './book';
import * as path from 'path';
import { Matchers, Pact } from '@pact-foundation/pact';

describe('UserServicePact', () => {

  const provider: Pact = new Pact({
    port: 1234,
    log: path.resolve(process.cwd(), 'pact', 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 3,
    logLevel: 'info',
    consumer: 'web-app',
    provider: 'books-service'
  });

  // Setup Pact mock server for this service
  beforeAll(async () => {
    await provider.setup();
  });

  // Configure Angular Testbed for this service
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        BooksService
      ]
    });
  });

  // Verify mock service
  afterEach(async () => {
    await provider.verify();
  });

  // Create contract
  afterAll(async () => {
    await provider.finalize();
  });

  describe('get()', () => {

    const userId = 1;

    const expectedBook: Book[] = [{
      title: 'Test Title',
      language: 'Language'
    }];

    beforeAll(async () => {
      await provider.addInteraction({
        state: `books available`,
        uponReceiving: 'a request to get all books',
        withRequest: {
          method: 'GET',
          path: `/api/books`
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            title: Matchers.string('Test Title'),
            language: Matchers.string('Language')
          }, {min: 1}),
        }
      });
    });

    it('should get a user', async () => {
      const booksService: BooksService = TestBed.get(BooksService);

      await booksService.getBooks().toPromise().then(response => {
        expect(response).toEqual(expectedBook);
      });
    });
  });
});
