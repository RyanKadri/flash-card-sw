import { Injectable } from "@angular/core";
import { QuizState } from "../../quiz/services/quiz-state";
import { PersistenceSchema } from "./persistence-types";
import { QuizInfo, ImageInfo } from "../../quiz/types/flash-card.types";
import { HasId, State } from "./state";
import { ImageState } from "../../quiz/services/image-state";
import { IDBImageData, RemoteImageData } from "../../quiz/services/image-service";

@Injectable({ providedIn: 'root'})
export class PersistenceSchemaService {

    quizSchema: PersistenceSchema<QuizInfo>;
    imageSchema: PersistenceSchema<ImageInfo, IDBImageData, RemoteImageData>;

    constructor(
        quizState: QuizState,
        imageState: ImageState,
    ) {

        this.quizSchema = {
            idbDatabase: 'quizzes',
            idbObjectStore: 'quiz-info',
    
            localState: quizState,
            

            remoteResource: (quiz) => `/api/quizzes/${quiz.id}`,
            remoteResourceBulk: '/api/quizzes'
        }

        this.imageSchema = {
            idbDatabase: 'quizzes',
            idbObjectStore: 'quiz-images',
            idbBeforePersist: (image) => ({ data: image.data }),
            idbAfterFetch: (image) => ({ ...image, url: URL.createObjectURL(image.data), data: undefined, type: image.data.type }),

            localState: imageState,

            remoteResource: (imaage) => `/api/images/${imaage.id}`,
            remoteResourceBulk: "/api/images"
        }
    }


}