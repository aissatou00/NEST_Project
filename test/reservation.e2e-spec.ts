import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';  // Remplacez avec votre module principal
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../src/reservation/reservation.entity';
import { User } from '../src/users/users.entity';

describe('ReservationController (e2e)', () => {
  let app: INestApplication;
  let reservationRepo: Repository<Reservation>;
  let accessToken: string;
  let user: User;

  beforeAll(async () => {
    // Création du module d'application et initialisation de l'application
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Assurez-vous que votre AppModule est bien importé
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Récupération du repository pour manipuler les entités de réservation
    reservationRepo = moduleFixture.get<Repository<Reservation>>(getRepositoryToken(Reservation));

    // Enregistrement d'un utilisateur et récupération de ses informations
    const userResponse = await request(app.getHttpServer()).post('/auth/register').send({
      username: 'testuser',
      password: 'testpass',
    });

    user = userResponse.body;

    // Connexion pour obtenir le token JWT
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'testuser',
      password: 'testpass',
    });

    accessToken = loginResponse.body.accessToken; // Sauvegarde du token
  });

  it('should create a reservation', async () => {
    // Création d'une réservation via la route POST
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ movieId: 123, startTime: '2025-02-05T16:00:00Z' });

    // Vérification de la création de la réservation
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id'); // Vérification que l'ID de la réservation est retourné
  });

  it('should retrieve all user reservations', async () => {
    // Récupération des réservations de l'utilisateur
    const response = await request(app.getHttpServer())
      .get('/reservations')
      .set('Authorization', `Bearer ${accessToken}`);

    // Vérification que la réponse est bien un tableau
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should cancel a reservation', async () => {
    // Création d'une nouvelle réservation pour un utilisateur
    const newReservation = await reservationRepo.save({
      user,
      movieId: 123,
      startTime: new Date(),
      endTime: new Date(),
    });

    // Annulation de la réservation via la route DELETE
    const response = await request(app.getHttpServer())
      .delete(`/reservations/${newReservation.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    // Vérification que la suppression a réussi
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    // Fermeture de l'application après les tests
    await app.close();
  });
});
