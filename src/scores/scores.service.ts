import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './score.entity';
import { CustomException } from 'src/exceptions';

@Injectable()
export class ScoresService {

    constructor(
        @InjectRepository(Score)
        private readonly scoresRepository: Repository<Score>
    ) { }

    async findWithPagination(sortBy: string, page: number, limit: number): Promise<{ data: Score[], totalCount: number }> {
        this.validatePage(page);
        const offset = (page - 1) * limit;
        const [data, totalCount] = await this.scoresRepository.findAndCount({
            order: sortBy ? { [sortBy]: 'DESC' } : {},
            skip: offset,
            take: limit,
        });

        return { data, totalCount };
    }

    private validatePage(page: number) {
        if (page < 1) {
            throw CustomException.BadRequest("Page number must be greater than 0.");
        }
    }

    async create(firstName: string, lastName: string, age: number, score: number): Promise<void> {
        const newScore = this.scoresRepository.create({ firstName, lastName, age, score });
        newScore.getValidation();
        this.scoresRepository.save(newScore);
    }

    async updateById(id: number, firstName: string, lastName: string, age: number, score: number): Promise<void> {
        const updateData = this.scoresRepository.create({ firstName, lastName, age, score });
        updateData.getValidation();
        const scoreToUpdate = await this.scoresRepository.findOne({ where: { id } }); // typeorm stupid
        if (!scoreToUpdate) {
            throw CustomException.NotFound(`Score with ID ${id} not found.`);
        }
        await this.scoresRepository.update(id, updateData);
    }

    async deleteAll(): Promise<void> {
        await this.scoresRepository.clear();
    }

    async deleteById(id: number): Promise<void> {
        const result = await this.scoresRepository.delete(id);
        if (result.affected < 1) {
            throw CustomException.NotFound(`Entry with ID ${id} not found.`)
        }
    }
}