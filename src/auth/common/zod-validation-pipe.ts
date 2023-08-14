import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
      return value;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(`Validation failed, message: ${error.issues[0].message}`);
      }
      throw error;
    }
  }
}



@Injectable()
export class CombinedValidationPipe implements PipeTransform {
  constructor(private paramQuerySchema?: ZodSchema<any>, private bodySchema?: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (this.paramQuerySchema && (metadata.type === 'param' || metadata.type === 'query')) {
      try {
        this.paramQuerySchema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BadRequestException(`Param/Query validation failed, message: ${error.issues[0].message}`);
        }
        throw error;
      }
    }

    if (this.bodySchema && metadata.type === 'body') {
      try {
        this.bodySchema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BadRequestException(`Body validation failed, message: ${error.issues[0].message}`);
        }
        throw error;
      }
    }

    return value;
  }
}
