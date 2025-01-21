import React from 'react';
import { GameLayout } from './GameLayout';
import { Youtube, Twitter, Instagram, Heart, ThumbsUp, Star, Award } from 'lucide-react';

export default function H3H3Tribute() {
  return (
    <GameLayout title="H3 Podcast Tribute">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=2048"
            alt="Studio Microphone"
            className="w-full h-[300px] sm:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">H3 Podcast</h1>
              <p className="text-xl text-white/90">A tribute to one of the most influential comedy podcasts</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: ThumbsUp, label: 'Subscribers', value: '3M+' },
            { icon: Star, label: 'Episodes', value: '300+' },
            { icon: Heart, label: 'Years Running', value: '6+' },
            { icon: Award, label: 'Awards', value: 'Multiple' }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/5 rounded-xl p-6 text-center">
              <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-white/60">{label}</div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="bg-white/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">About the Show</h2>
          <p className="text-white/80 leading-relaxed mb-6">
            The H3 Podcast, hosted by Ethan and Hila Klein, has evolved from its humble beginnings 
            into one of the most influential comedy podcasts. Known for their unique blend of humor, 
            commentary, and interviews, they've created a cultural phenomenon that resonates with 
            millions of viewers worldwide.
          </p>
          <p className="text-white/80 leading-relaxed">
            From iconic moments like the Vape Nation to groundbreaking interviews with celebrities 
            and internet personalities, the H3 Podcast has consistently pushed boundaries while 
            maintaining its authentic voice and connection with its audience.
          </p>
        </div>

        {/* Memorable Episodes */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Memorable Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Post Malone Episode",
                description: "An iconic episode featuring Post Malone that showcased the natural chemistry between the hosts and their guest.",
                date: "2017"
              },
              {
                title: "Bill Burr Interview",
                description: "A legendary conversation with comedian Bill Burr that perfectly balanced humor and serious discussion.",
                date: "2019"
              },
              {
                title: "Bo Burnham Special",
                description: "A deep dive into creativity and comedy with the brilliant Bo Burnham.",
                date: "2018"
              }
            ].map(episode => (
              <div key={episode.title} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-2">{episode.title}</h3>
                <p className="text-white/60 mb-4">{episode.description}</p>
                <div className="text-purple-400 text-sm">{episode.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 py-8">
          {[
            { icon: Youtube, href: "https://youtube.com/h3podcast", label: "YouTube" },
            { icon: Twitter, href: "https://twitter.com/theh3podcast", label: "Twitter" },
            { icon: Instagram, href: "https://instagram.com/h3podcast", label: "Instagram" }
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              aria-label={label}
            >
              <Icon className="w-6 h-6 text-white" />
            </a>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}