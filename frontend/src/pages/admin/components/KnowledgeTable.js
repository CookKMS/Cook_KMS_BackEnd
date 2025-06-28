// src/pages/admin/components/KnowledgeTable.js

import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';
import '../../../styles/Admin/KnowledgeTable.css';

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

export default function KnowledgeTable() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const itemsPerPage = 5;

  // ✅ 문서 목록 불러오기
  const fetchKnowledge = async () => {
    try {
      const res = await axios.get('/api/knowledge');
      setData(res.data);
    } catch (error) {
      console.error('문서 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const filtered = data.filter((item) => {
    const matchCategory = filter === '전체' || item.category === filter;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ 문서 삭제
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/knowledge/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchKnowledge();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // ✅ 문서 등록/수정
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const content = form.content.value;
    const file = form.file.files[0];

    try {
      let fileIds = [];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await axios.post('/api/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fileIds = [uploadRes.data.file_id];
      }

      const payload = {
        title,
        content,
        category,
        tags: [],
        files: fileIds,
      };

      if (editingItem) {
        await axios.put(`/api/knowledge/${editingItem.id}`, payload);
      } else {
        await axios.post('/api/knowledge/create', payload);
      }

      setShowModal(false);
      setEditingItem(null);
      fetchKnowledge();
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  return (
    <div className="knowledge-table-wrapper">
      {/* ... 생략된 UI 코드 (필터, 테이블, 모달 등) ... */}
      {/* 필요한 경우 제공 가능 */}
    </div>
  );
}
