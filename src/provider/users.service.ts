import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Users } from '../interface/users.interface';
import { getAuth as getAuthadmin } from 'firebase-admin/auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { emit } from 'process';
import { elementAt } from 'rxjs';

@Injectable()
class UsersService {
  private readonly users: Users[] = [];
  private usersresultcount = {
    message: '',
    count: 0,
    result: null,
  };
  private usersresult = {
    message: '',
    result: null,
  };

  async findOneAvatar(email: string): Promise<any> {
    const db = getFirestore();
    const UsersRef = db.collection('Users');
    const queryRef = UsersRef.where('email', '==', email);
    const doc = await queryRef.get();
    if (doc.empty) {
      console.log('Document is Empty');
      return null;
    } else {
      const avatar: any[] = doc.docs.map((element) => {
        return element.data();
      });
      this.usersresult.message = 'OK';
      this.usersresult.result = avatar;
      return this.usersresult;
    }
  }

  async findOne(id: string): Promise<any> {
    const OneUsers = async (id: string) => {
      this.users.length = 0;
      await getAuthadmin()
        .getUser(id)
        .then(async (userRecord) => {
          this.users.push({
            id: userRecord.uid,
            avatar:
              userRecord.photoURL ??
              'https://cdn-icons-png.flaticon.com/512/1811/1811885.png',
            phone: userRecord.phoneNumber,
            displayname: userRecord.displayName,
            email: userRecord.email,
            password: userRecord.passwordHash,
            create_at: userRecord.metadata.creationTime,
            update_at: userRecord.metadata.lastRefreshTime,
            lastsignin_at: userRecord.metadata.lastSignInTime,
          });
          this.usersresult.message = 'Ok';
          this.usersresult.result = this.users;
        })
        .catch((error) => {
          this.usersresult.message = error.code;
        });
    };
    await OneUsers(id);
    return this.usersresult;
  }

  async findAll(): Promise<any> {
    const listAllUsers = async (nextPageToken?: string) => {
      this.users.length = 0;
      await getAuthadmin()
        .listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
          listUsersResult.users.forEach(async (userRecord) => {
            this.users.push({
              id: userRecord.uid,
              avatar:
                userRecord.photoURL ??
                'https://cdn-icons-png.flaticon.com/512/1811/1811885.png',
              phone: userRecord.phoneNumber,
              displayname: userRecord.displayName,
              email: userRecord.email,
              password: userRecord.passwordHash,
              create_at: userRecord.metadata.creationTime,
              update_at: userRecord.metadata.lastRefreshTime,
              lastsignin_at: userRecord.metadata.lastSignInTime,
            });
            this.usersresult.message = 'Ok';
            this.usersresult.result = this.users;
          });

          if (listUsersResult.pageToken) {
            listAllUsers(listUsersResult.pageToken);
          }
        })
        .catch((error) => {
          this.usersresult.message = error.code;
        });
      return this.usersresult;
    };
    await listAllUsers();
    return this.usersresult;
  }

  async findCount(): Promise<any> {
    const listAllUsers = async (nextPageToken?: string) => {
      this.users.length = 0;
      await getAuthadmin()
        .listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
          listUsersResult.users.forEach(async (userRecord) => {
            this.users.push({
              id: userRecord.uid,
              avatar:
                userRecord.photoURL ??
                'https://cdn-icons-png.flaticon.com/512/1811/1811885.png',
              phone: userRecord.phoneNumber,
              displayname: userRecord.displayName,
              email: userRecord.email,
              password: userRecord.passwordHash,
              create_at: userRecord.metadata.creationTime,
              update_at: userRecord.metadata.lastRefreshTime,
              lastsignin_at: userRecord.metadata.lastSignInTime,
            });
            this.usersresultcount.message = 'Ok';
            this.usersresultcount.count = this.users.length;
            this.usersresultcount.result = this.users;
          });
          if (listUsersResult.pageToken) {
            listAllUsers(listUsersResult.pageToken);
          }
        })
        .catch((error) => {
          this.usersresult.message = error.code;
        });
    };
    await listAllUsers();
    return this.usersresultcount;
  }

  async create(email: string, password: string) {
    this.users.length = 0;
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user: any = userCredential.user;
        this.usersresult.message = 'Ok';
        this.usersresult.result = user.stsTokenManager.accessToken;
      })
      .catch((error) => {
        this.usersresult.message = error.code;
      });
    return this.usersresult;
  }

  async update(body: Users, uid: string) {
    this.users.length = 0;
    await getAuthadmin()
      .updateUser(uid, {
        phoneNumber: body.phone,
        displayName: body.displayname,
        photoURL: body.avatar,
      })
      .then((userRecord) => {
        this.usersresult.message = 'Successfully updated';
        this.usersresult.result = userRecord;
      })
      .catch((error) => {
        this.usersresult.message = error.code;
      });
    return this.usersresult;
  }

  async delete(id: string) {
    this.users.length = 0;
    await getAuthadmin()
      .deleteUser(id)
      .then(() => {
        this.usersresult.message = 'Successfully Deleted';
      })
      .catch((error) => {
        this.usersresult.message = error.code;
      });
    return this.usersresult;
  }
}

export default UsersService;
