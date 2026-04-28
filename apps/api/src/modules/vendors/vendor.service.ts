import { VendorRepository } from './vendor.repository';

const repo = new VendorRepository();

export class VendorService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    return repo.findById(id);
  }
}
