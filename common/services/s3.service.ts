import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {Multer} from 'multer';
import {file} from 'multer';

@Injectable()
export class S3Service {
  private readonly s3Client;

  constructor(
    private configService: ConfigService,
  ) {
    this.s3Client =
      new S3Client({
        region:
          this.configService.getOrThrow(
            'AWS_REGION',
          ),

        credentials: {
          accessKeyId:
            this.configService.getOrThrow(
              'AWS_ACCESS_KEY_ID',
            ),

          secretAccessKey:
            this.configService.getOrThrow(
              'AWS_SECRET_ACCESS_KEY',
            ),
        },
      });
  }

    async uploadFile(
    file: Multer.File,
    ) {
        const key =
        `avatars/${Date.now()}-${
            file.originalname
        }`;
        await this.s3Client.send(
        new PutObjectCommand({
            Bucket:
            this.configService.getOrThrow(
                'AWS_S3_BUCKET',
            ),
            Key: key,
            Body: file.buffer,
            ContentType:
            file.mimetype,
        }),
        );
        return key;
    }
}