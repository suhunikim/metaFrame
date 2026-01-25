import { Tree } from 'antd';
import { FolderOpenOutlined, FileTextOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

// [임시 데이터] 화면에 뭐라도 나와야 하니까 가짜 데이터를 만듭니다.
const mockTreeData: DataNode[] = [
    {
        key: 'root',
        title: 'SK_Hynix_WMS',
        icon: <FolderOpenOutlined />,
        children: [
            {
                key: 'src',
                title: 'src',
                icon: <FolderOpenOutlined />,
                children: [
                    { key: 'App.tsx', title: 'App.tsx', icon: <FileTextOutlined />, isLeaf: true },
                    { key: 'main.tsx', title: 'main.tsx', icon: <FileTextOutlined />, isLeaf: true },
                ],
            },
            { key: 'package.json', title: 'package.json', icon: <FileTextOutlined />, isLeaf: true },
        ],
    },
];

export default function FileExplorer() {
    return (
        <div style={{ height: '100%' }}>
            {/* 앤트 디자인의 트리(Tree) 컴포넌트 */}
            <Tree
                showIcon
                defaultExpandAll
                treeData={mockTreeData}
                // 배경을 투명하게 해서 뒤에 깔릴 색이 보이게 합니다.
                style={{ backgroundColor: 'transparent', color: 'inherit' }}
            />
        </div>
    );
}