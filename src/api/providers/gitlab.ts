import { SyncData } from '@esync/data';
import { Context as request } from 'grest/src/app/Context/Context';
import { ApiOperationStatus, ApiProvider } from '../types';

export class Gitlab implements ApiProvider {
  private static SNIPPETS_API_URL = 'https://gitlab.com/api/v4/snippets';

  private snippetId: string;
  private userToken: string;

  constructor(snippetId: string, userToken: string) {
    this.snippetId = snippetId;
    this.userToken = userToken;
  }

  async upload(syncData: SyncData): Promise<ApiOperationStatus> {
    const { status } = await request.fetch(`${Gitlab.SNIPPETS_API_URL}/${this.snippetId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'PRIVATE-TOKEN': `${this.userToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        title: 'Extensions Sync',
        content: JSON.stringify(syncData),
      },
      method: 'PUT',
    });

    return status === 200 ? ApiOperationStatus.SUCCESS : ApiOperationStatus.FAIL;
  }

  async download(): Promise<SyncData> {
    const { body } = await request.fetch(`${Gitlab.SNIPPETS_API_URL}/${this.snippetId}/raw`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'PRIVATE-TOKEN': `${this.userToken}`,
      },
      method: 'GET',
    });

    return body;
  }

  getName(): string {
    return 'Gitlab';
  }
}
