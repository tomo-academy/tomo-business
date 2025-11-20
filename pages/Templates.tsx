import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { db } from '../lib/database';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  Sparkles, Copy, Check, Briefcase, Code, Heart, 
  Music, Camera, GraduationCap, Store, Palette 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  preview: {
    displayName: string;
    title: string;
    bio: string;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      fontFamily: string;
      layout: string;
    };
  };
}

const templates: Template[] = [
  {
    id: 'business-professional',
    name: 'Business Professional',
    description: 'Perfect for executives and business professionals',
    category: 'Business',
    icon: <Briefcase size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Chief Executive Officer',
      bio: 'Leading innovation and driving growth in the digital age.',
      theme: {
        primaryColor: '#1a56db',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        layout: 'classic'
      }
    }
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Showcase your creative portfolio with style',
    category: 'Creative',
    icon: <Palette size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Creative Designer',
      bio: 'Crafting beautiful experiences through design and innovation.',
      theme: {
        primaryColor: '#f59e0b',
        backgroundColor: '#fef3c7',
        fontFamily: 'Playfair Display',
        layout: 'modern'
      }
    }
  },
  {
    id: 'tech-developer',
    name: 'Tech Developer',
    description: 'For developers and tech professionals',
    category: 'Technology',
    icon: <Code size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Full Stack Developer',
      bio: 'Building scalable applications with modern technologies.',
      theme: {
        primaryColor: '#10b981',
        backgroundColor: '#000000',
        fontFamily: 'Roboto Mono',
        layout: 'minimal'
      }
    }
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'For startup founders and business owners',
    category: 'Business',
    icon: <Store size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Founder & CEO',
      bio: 'Building the future, one startup at a time.',
      theme: {
        primaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        layout: 'classic'
      }
    }
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Perfect for visual artists and photographers',
    category: 'Creative',
    icon: <Camera size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Professional Photographer',
      bio: 'Capturing moments that tell stories.',
      theme: {
        primaryColor: '#ec4899',
        backgroundColor: '#1f2937',
        fontFamily: 'Playfair Display',
        layout: 'modern'
      }
    }
  },
  {
    id: 'musician',
    name: 'Musician',
    description: 'For artists and music professionals',
    category: 'Creative',
    icon: <Music size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Music Producer',
      bio: 'Creating sounds that move people.',
      theme: {
        primaryColor: '#ef4444',
        backgroundColor: '#000000',
        fontFamily: 'Inter',
        layout: 'minimal'
      }
    }
  },
  {
    id: 'educator',
    name: 'Educator',
    description: 'For teachers and educational professionals',
    category: 'Education',
    icon: <GraduationCap size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Education Specialist',
      bio: 'Empowering minds and inspiring future leaders.',
      theme: {
        primaryColor: '#0ea5e9',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        layout: 'classic'
      }
    }
  },
  {
    id: 'influencer',
    name: 'Social Influencer',
    description: 'Perfect for content creators and influencers',
    category: 'Social',
    icon: <Heart size={24} />,
    preview: {
      displayName: 'Your Name',
      title: 'Content Creator',
      bio: 'Sharing stories and inspiring communities worldwide.',
      theme: {
        primaryColor: '#f43f5e',
        backgroundColor: '#fef2f2',
        fontFamily: 'Inter',
        layout: 'modern'
      }
    }
  }
];

export const Templates: React.FC = () => {
  const { user, updateCard } = useAppStore();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Business', 'Creative', 'Technology', 'Education', 'Social'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const applyTemplate = async (template: Template) => {
    if (!user) {
      alert('Please sign in to use templates');
      return;
    }

    setLoading(true);
    try {
      // Apply template to user's card
      await updateCard({
        theme: template.preview.theme
      });

      setAppliedTemplate(template.id);
      setTimeout(() => {
        setAppliedTemplate(null);
        navigate('/editor');
      }, 1500);
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Failed to apply template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            Card Templates
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900">
            Choose Your Style
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Start with a professionally designed template and customize it to match your brand
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Preview */}
              <div 
                className="h-64 p-8 flex flex-col justify-center items-center relative"
                style={{ 
                  backgroundColor: template.preview.theme.backgroundColor,
                  color: template.preview.theme.backgroundColor === '#000000' ? '#ffffff' : '#000000'
                }}
              >
                <div className="absolute top-4 right-4 p-3 bg-white/90 rounded-xl shadow-lg">
                  {template.icon}
                </div>
                <div className="text-center space-y-2">
                  <h3 
                    className="text-2xl font-bold"
                    style={{ fontFamily: template.preview.theme.fontFamily }}
                  >
                    {template.preview.displayName}
                  </h3>
                  <p 
                    className="text-sm opacity-80"
                    style={{ fontFamily: template.preview.theme.fontFamily }}
                  >
                    {template.preview.title}
                  </p>
                  <div 
                    className="w-12 h-1 mx-auto rounded-full"
                    style={{ backgroundColor: template.preview.theme.primaryColor }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-4 border-t border-zinc-100">
                <div>
                  <h4 className="font-bold text-lg text-zinc-900">{template.name}</h4>
                  <p className="text-sm text-zinc-600 mt-1">{template.description}</p>
                </div>

                <Button
                  onClick={() => applyTemplate(template)}
                  disabled={loading}
                  className="w-full"
                  style={{ backgroundColor: template.preview.theme.primaryColor }}
                >
                  {loading && appliedTemplate === template.id ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Applied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Use This Template
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No templates found in this category</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
