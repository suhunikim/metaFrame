// src/store/fileStore.ts
import { create } from 'zustand';

// 1. 파일 데이터 타입 정의 (규격서)
export interface FileNode {
    id: string;             // 고유 ID
    name: string;           // 파일명
    type: 'file' | 'folder'; // 중요: 오타 방지
    children?: FileNode[];  // 중요: 자기 참조 (재귀)
}

// 2. 스토어 상태(State)와 액션(Action) 타입 정의
interface FileState {
    files: FileNode[];                // 1. 전체 파일 목록 (데이터)
    selectedId: string | null;        // 2. 현재 선택된 파일 ID (데이터)
    selectFile: (id: string) => void; // 3. 파일을 선택하는 기능 (함수)
}

// 3. Zustand 스토어 생성 (여기가 핵심 엔진)
export const useFileStore = create<FileState>((set) => ({
    // 초기 데이터 (나중에 DB에서 가져오겠지만, 지금은 가짜 데이터로 시작)
    files: [
        {
            id: 'root',
            name: 'SK_Hynix_WMS',
            type: 'folder',
            children: [
                {
                    id: 'src',
                    name: 'src',
                    type: 'folder',
                    children: [
                        { id: 'home', name: 'Home.tsx', type: 'file' },
                        { id: 'utils', name: 'utils.ts', type: 'file' },
                    ],
                },
                { id: 'pkg', name: 'package.json', type: 'file' },
            ],
        },
    ],
    selectedId: null, // 처음엔 아무것도 선택 안 됨

    // 액션: 이 함수를 부르면 selectedId 값을 바꿉니다.
    // jQuery: selectedId = id; render(); 와 같음
    selectFile: (id) => set({ selectedId: id }),
}));