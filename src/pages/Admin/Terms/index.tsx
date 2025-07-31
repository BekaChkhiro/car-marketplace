import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { buildApiUrl } from '../../../utils/api';
import { getAccessToken, removeStoredToken } from '../../../api/utils/tokenStorage';

interface Term {
  id: number;
  title: string;
  content: string;
  section_order: number;
  created_at: string;
  updated_at: string;
}

const TermsManagement: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedContent, setExpandedContent] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    section_order: 0
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('api/terms'));
      const data = await response.json();
      
      if (data.success) {
        setTerms(data.data);
      } else {
        setError('წესებისა და პირობების ჩატვირთვა ვერ მოხერხდა');
      }
    } catch (err) {
      setError('შეცდომა წესებისა და პირობების ჩატვირთვისას');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setError('ავტორიზაცია საჭიროა. გთხოვთ გაიაროთ შესვლა.');
        return;
      }
      
      // Set section_order to be at the end
      const newFormData = {
        ...formData,
        section_order: terms.length
      };
      
      const response = await fetch(buildApiUrl('api/terms'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFormData)
      });

      if (response.status === 401) {
        setError('სესია ამოიწურა. გთხოვთ ხელახლა გაიაროთ შესვლა.');
        removeStoredToken();
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setTerms([...terms, data.data]);
        setShowAddForm(false);
        setFormData({ title: '', content: '', section_order: terms.length });
      } else {
        setError(data.message || 'სექციის შექმნა ვერ მოხერხდა');
      }
    } catch (err) {
      setError('შეცდომა სექციის შექმნისას');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const term = terms.find(t => t.id === id);
      if (!term) return;

      const token = getAccessToken();
      if (!token) {
        setError('ავტორიზაცია საჭიროა. გთხოვთ გაიაროთ შესვლა.');
        return;
      }
      
      const response = await fetch(buildApiUrl(`api/terms/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: term.title,
          content: term.content,
          section_order: term.section_order
        })
      });

      if (response.status === 401) {
        setError('სესია ამოიწურა. გთხოვთ ხელახლა გაიაროთ შესვლა.');
        removeStoredToken();
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setTerms(terms.map(t => t.id === id ? data.data : t));
        setEditingId(null);
      } else {
        setError(data.message || 'სექციის განახლება ვერ მოხერხდა');
      }
    } catch (err) {
      setError('შეცდომა სექციის განახლებისას');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('დარწმუნებული ხართ, რომ გსურთ ამ სექციის წაშლა?')) return;

    try {
      const token = getAccessToken();
      if (!token) {
        setError('ავტორიზაცია საჭიროა. გთხოვთ გაიაროთ შესვლა.');
        return;
      }
      
      const response = await fetch(buildApiUrl(`api/terms/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setError('სესია ამოიწურა. გთხოვთ ხელახლა გაიაროთ შესვლა.');
        removeStoredToken();
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setTerms(terms.filter(t => t.id !== id));
      } else {
        setError(data.message || 'სექციის წაშლა ვერ მოხერხდა');
      }
    } catch (err) {
      setError('შეცდომა სექციის წაშლისას');
    }
  };

  const handleFieldChange = (id: number, field: keyof Term, value: string | number) => {
    setTerms(terms.map(term => 
      term.id === id ? { ...term, [field]: value } : term
    ));
  };

  const moveTermUp = async (id: number) => {
    const termIndex = terms.findIndex(t => t.id === id);
    if (termIndex <= 0) return;

    const newTerms = [...terms];
    const temp = newTerms[termIndex].section_order;
    newTerms[termIndex].section_order = newTerms[termIndex - 1].section_order;
    newTerms[termIndex - 1].section_order = temp;
    
    setTerms(newTerms.sort((a, b) => a.section_order - b.section_order));
    
    // Update both terms on server
    await updateTermOrder(newTerms[termIndex].id, newTerms[termIndex].section_order);
    await updateTermOrder(newTerms[termIndex - 1].id, newTerms[termIndex - 1].section_order);
  };

  const moveTermDown = async (id: number) => {
    const termIndex = terms.findIndex(t => t.id === id);
    if (termIndex >= terms.length - 1) return;

    const newTerms = [...terms];
    const temp = newTerms[termIndex].section_order;
    newTerms[termIndex].section_order = newTerms[termIndex + 1].section_order;
    newTerms[termIndex + 1].section_order = temp;
    
    setTerms(newTerms.sort((a, b) => a.section_order - b.section_order));
    
    // Update both terms on server
    await updateTermOrder(newTerms[termIndex].id, newTerms[termIndex].section_order);
    await updateTermOrder(newTerms[termIndex + 1].id, newTerms[termIndex + 1].section_order);
  };

  const updateTermOrder = async (id: number, newOrder: number) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const term = terms.find(t => t.id === id);
      if (!term) return;

      await fetch(buildApiUrl(`api/terms/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: term.title,
          content: term.content,
          section_order: newOrder
        })
      });
    } catch (err) {
      console.error('Error updating term order:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">წესები და პირობების მართვა</h1>
              <p className="text-gray-600">მართეთ თქვენი პლატფორმის წესებისა და პირობების სექციები</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              ახალი სექციის დამატება
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="text-red-400 mr-3">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Quick Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">ახალი სექციის დამატება</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ title: '', content: '', section_order: terms.length });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="სექციის სათაური..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
              />
              
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                placeholder="სექციის შინაარსი..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  დამატება
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: '', content: '', section_order: terms.length });
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  გაუქმება
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terms List */}
        <div className="space-y-4">
          {terms.map((term, index) => (
            <div key={term.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Drag Handle */}
                    <div className="text-gray-400">
                      <GripVertical size={16} />
                    </div>
                    
                    {/* Position Badge */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary min-w-[32px] justify-center">
                      {index + 1}
                    </span>
                    
                    {/* Title */}
                    {editingId === term.id ? (
                      <input
                        type="text"
                        value={term.title}
                        onChange={(e) => handleFieldChange(term.id, 'title', e.target.value)}
                        className="text-lg font-semibold flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        className="text-lg font-semibold text-gray-900 flex-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => expandedContent === term.id ? setExpandedContent(null) : setExpandedContent(term.id)}
                      >
                        {term.title}
                      </h3>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Move Up/Down Buttons */}
                    {editingId !== term.id && (
                      <>
                        <button
                          onClick={() => moveTermUp(term.id)}
                          disabled={index === 0}
                          className={`p-1.5 rounded-md transition-colors ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:text-primary hover:bg-primary/10'
                          }`}
                          title="ზემოთ გადატანა"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveTermDown(term.id)}
                          disabled={index === terms.length - 1}
                          className={`p-1.5 rounded-md transition-colors ${
                            index === terms.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:text-primary hover:bg-primary/10'
                          }`}
                          title="ქვემოთ გადატანა"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </>
                    )}
                    
                    {/* Edit/Save/Cancel/Delete */}
                    {editingId === term.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(term.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors text-sm font-medium"
                          title="შენახვა"
                        >
                          <Save size={16} />
                          შენახვა
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            fetchTerms();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm font-medium"
                          title="გაუქმება"
                        >
                          <X size={16} />
                          გაუქმება
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingId(term.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium"
                          title="რედაქტირება"
                        >
                          <Edit size={16} />
                          რედაქტირება
                        </button>
                        <button
                          onClick={() => handleDelete(term.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-sm font-medium"
                          title="წაშლა"
                        >
                          <Trash2 size={16} />
                          წაშლა
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              {(editingId === term.id || expandedContent === term.id) && (
                <div className="p-4">
                  {editingId === term.id ? (
                    <textarea
                      value={term.content}
                      onChange={(e) => handleFieldChange(term.id, 'content', e.target.value)}
                      rows={8}
                      placeholder="სექციის შინაარსი..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  ) : (
                    <div className="prose prose-gray max-w-none">
                      {term.content ? (
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                          {term.content}
                        </div>
                      ) : (
                        <div className="text-gray-400 italic text-sm">შინაარსი არ არის მითითებული</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {terms.length === 0 && (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ჯერ არ არის წესების სექციები</h3>
              <p className="text-gray-500 mb-6">დაიწყეთ პირველი წესებისა და პირობების სექციის შექმნით.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                პირველი სექციის დამატება
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsManagement;