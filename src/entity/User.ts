import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'int', name: 'user_id', unsigned: true })
    userId: number;

    @Column('varchar', { name: 'user_first_name', length: 20 })
    userFirstName: string;

    @Column('varchar', { name: 'user_last_name', length: 20 })
    userLastName: string;

    @Column('varchar', { name: 'user_avatar', length: 100, nullable: true })
    userAvatar: string | null;

    @Index({ unique: true })
    @Column('varchar', { name: 'user_email', length: 50 })
    userEmail: string;

    @Column('varchar', { name: 'user_password', length: 32 })
    userPassword: string;

    @Column('varchar', { name: 'user_salt', length: 5 })
    userSalt: string;

    @Column('datetime', { name: 'user_create_date', default: () => 'CURRENT_TIMESTAMP' })
    userCreateDate: Date;

    @Column('datetime', { name: 'user_last_login_date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })

    @Column('datetime', { name: 'user_update_date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    userUpdateDate: Date | null;
}
