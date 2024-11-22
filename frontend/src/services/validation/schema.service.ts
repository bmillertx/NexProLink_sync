import { z } from 'zod';
import { errorService } from '../error/error.service';

// Base schemas for common fields
const timestampFields = {
  createdAt: z.date(),
  updatedAt: z.date(),
};

const userBaseFields = {
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(2),
  photoURL: z.string().url().optional(),
  emailVerified: z.boolean(),
  ...timestampFields,
};

// Schema Definitions
export const userSchema = z.object({
  ...userBaseFields,
  role: z.enum(['client', 'consultant']),
  availability: z.object({
    timezone: z.string(),
  }),
  professionalInfo: z.object({
    title: z.string(),
    specializations: z.array(z.string()),
    experience: z.number(),
    education: z.array(z.string()),
    certifications: z.array(z.string()),
  }).optional(),
});

export const appointmentSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  consultantId: z.string(),
  date: z.date(),
  duration: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
  ...timestampFields,
});

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  read: z.boolean(),
  ...timestampFields,
});

export const reviewSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  consultantId: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  ...timestampFields,
});

export const settingsSchema = z.object({
  userId: z.string(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'contacts']),
    showOnlineStatus: z.boolean(),
  }),
  ...timestampFields,
});

class SchemaService {
  private static instance: SchemaService;

  private constructor() {}

  static getInstance(): SchemaService {
    if (!SchemaService.instance) {
      SchemaService.instance = new SchemaService();
    }
    return SchemaService.instance;
  }

  /**
   * Validate data against a schema
   */
  validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedError = new Error(this.formatZodError(error));
        errorService.handleError(formattedError, {
          validationType: 'schema',
          schema: schema._def.typeName,
        });
        throw formattedError;
      }
      throw error;
    }
  }

  /**
   * Format Zod validation errors into user-friendly messages
   */
  private formatZodError(error: z.ZodError): string {
    return error.errors
      .map(err => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      })
      .join(', ');
  }

  /**
   * Validate user data
   */
  validateUser(data: unknown) {
    return this.validate(userSchema, data);
  }

  /**
   * Validate appointment data
   */
  validateAppointment(data: unknown) {
    return this.validate(appointmentSchema, data);
  }

  /**
   * Validate message data
   */
  validateMessage(data: unknown) {
    return this.validate(messageSchema, data);
  }

  /**
   * Validate review data
   */
  validateReview(data: unknown) {
    return this.validate(reviewSchema, data);
  }

  /**
   * Validate settings data
   */
  validateSettings(data: unknown) {
    return this.validate(settingsSchema, data);
  }

  /**
   * Partial validation for updates
   */
  validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> {
    const partialSchema = schema.partial();
    return this.validate(partialSchema, data);
  }
}

export const schemaService = SchemaService.getInstance();
