export interface S3Object {
  id: string
  name: string
  type: 'folder' | 'file'
  size?: string
  lastModified?: string
}

export interface S3DetailFormData {
  searchQuery: string
  selectedObjects: string[]
  currentPath: string
  objects: S3Object[]
}

export const SAMPLE_OBJECTS: S3Object[] = [
  {
    id: '1',
    name: 'images',
    type: 'folder',
  },
  {
    id: '2',
    name: 'documents',
    type: 'folder',
  },
  {
    id: '3',
    name: 'index.html',
    type: 'file',
    size: '2.4 KB',
    lastModified: '2024년 12월 15일 14:30',
  },
  {
    id: '4',
    name: 'app.js',
    type: 'file',
    size: '45.2 KB',
    lastModified: '2024년 12월 20일 09:15',
  },
  {
    id: '5',
    name: 'styles.css',
    type: 'file',
    size: '8.7 KB',
    lastModified: '2024년 12월 18일 16:45',
  },
  {
    id: '6',
    name: 'README.md',
    type: 'file',
    size: '1.2 KB',
    lastModified: '2024년 12월 10일 11:20',
  },
]
