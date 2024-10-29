
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { saveAs } from "file-saver";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import SuggetionCard from "./components/suggetion-card";
import { AlbumArtwork, LoadingAlbumArtwork } from "./components/album-artwork";
import { Sidebar } from "./components/sidebar";
import { playlists } from "./data/playlists";
import { ModeToggle } from "@/components/ModeToggle";
import { ApiResponse } from "./type";

export default function MusicPage() {
  const [searchValue, setSearchValue] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const main_api = "https://saavn.dev/api";
  const genresList = ["Pop", "Rock", "Hip Hop", "Classical", "Jazz"];

  const trendingAPI = `${main_api}/search/songs?query=trending&page=1&limit=30`;
  const moreTracksAPI = `${main_api}/search/songs?query=more-tracks&page=1&limit=30`;
  const genreAPI = (genre: string) => `${main_api}/search/songs?query=${genre}&page=1&limit=30`;
  const searchAPI = (query: string) => `${main_api}/search/songs?query=${query}&page=1&limit=30`;

  const { isLoading: isTrendingLoading, data: trendingSongs } = useQuery<ApiResponse>({
    queryKey: ["trending-songs"],
    queryFn: () => fetch(trendingAPI).then((res) => res.json()),
  });

  const { isLoading: isMoreTracksLoading, data: moreTracks } = useQuery<ApiResponse>({
    queryKey: ["more-tracks"],
    queryFn: () => fetch(moreTracksAPI).then((res) => res.json()),
  });

  const { isLoading: isGenreSongsLoading, data: genreSongs } = useQuery<ApiResponse>({
    queryKey: ["genre-songs", selectedGenre],
    queryFn: () => fetch(genreAPI(selectedGenre)).then((res) => res.json()),
    enabled: !!selectedGenre, // Only fetch if a genre is selected
  });

  const { isLoading: isSearchLoading, data: searchResults } = useQuery<ApiResponse>({
    queryKey: ["search-songs", searchValue],
    queryFn: () => fetch(searchAPI(searchValue)).then((res) => res.json()),
    enabled: !!searchValue,
  });

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setSearchValue(""); // Clear search value when genre is selected
  };

  function downloadImage(imageUrl: string, imageName: string) {
    saveAs(imageUrl, `${imageName}.mp3`);
  }

  return (
    <div className="block">
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar playlists={playlists} className="hidden lg:block" />
            <div className="col-span-3 lg:col-span-4 lg:grid-cols-5">
              {/* Search, Genre, and ModeToggle Section */}
              <section className="flex flex-col gap-4 px-4 py-6 lg:px-8">
                <div className="flex items-center justify-between w-full max-w-[650px]">
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search Songs..."
                    className="w-full"
                  />
                  <div className="flex items-center space-x-4 ml-4">
                    <ModeToggle />
                    <Image
                      src="/user.png"
                      alt="User Profile"
                      width={40}
                      height={50}
                      className="rounded-full cursor-pointer"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white-700">Genres</h3>
                <div className="flex space-x-4 overflow-x-auto">
                  {genresList.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      onClick={() => handleGenreClick(genre)}
                      className={`text-white-500 ${selectedGenre === genre ? "bg-purple-500" : ""}`} 
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </section>

              <div className="h-full px-4 py-6 lg:px-8">
                {/* Trending Section */}
                <section className="border-none p-0 outline-none">
                  <div className="mt-6 space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Trending Songs</h2>
                  </div>
                  <Separator className="my-4" />
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {isTrendingLoading ? (
                        Array(6)
                          .fill(null)
                          .map((_, i) => (
                            <LoadingAlbumArtwork key={i} width={150} height={200} />
                          ))
                      ) : (
                        trendingSongs?.data.results.map((d, i) => (
                          <AlbumArtwork
                            key={i}
                            name={d.name}
                            img={d.image[2].url}
                            category={d.album.name}
                            handleDownload={() => downloadImage(d.downloadUrl[4].url, d.name)}
                            onClick={() => {
                              setMusicUrl(d.downloadUrl[4].url);
                              setCurrentArtist(d.primaryArtists);
                            }}
                          />
                        ))
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </section>

                {/* More Tracks Section */}
                <section className="border-none p-0 outline-none">
                  <div className="mt-6 space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">More Tracks</h2>
                  </div>
                  <Separator className="my-4" />
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {isMoreTracksLoading ? (
                        Array(6)
                          .fill(null)
                          .map((_, i) => (
                            <LoadingAlbumArtwork key={i} width={150} height={200} />
                          ))
                      ) : (
                        moreTracks?.data.results.map((d, i) => (
                          <AlbumArtwork
                            key={i}
                            name={d.name}
                            img={d.image[2].url}
                            category={d.album.name}
                            handleDownload={() => downloadImage(d.downloadUrl[4].url, d.name)}
                            onClick={() => {
                              setMusicUrl(d.downloadUrl[4].url);
                              setCurrentArtist(d.primaryArtists);
                            }}
                          />
                        ))
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </section>

                {/* Genre Songs Section */}
                {selectedGenre && (
                  <section className="border-none p-0 outline-none">
                    <div className="mt-6 space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">Songs in {selectedGenre}</h2>
                    </div>
                    <Separator className="my-4" />
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {isGenreSongsLoading ? (
                          Array(6)
                            .fill(null)
                            .map((_, i) => (
                              <LoadingAlbumArtwork key={i} width={150} height={200} />
                            ))
                        ) : (
                          genreSongs?.data.results.map((d, i) => (
                            <AlbumArtwork
                              key={i}
                              name={d.name}
                              img={d.image[2].url}
                              category={d.album.name}
                              handleDownload={() => downloadImage(d.downloadUrl[4].url, d.name)}
                              onClick={() => {
                                setMusicUrl(d.downloadUrl[4].url);
                                setCurrentArtist(d.primaryArtists);
                              }}
                            />
                          ))
                        )}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </section>
                )}

                {/* Search Results Section */}
                {searchValue && (
                  <section className="border-none p-0 outline-none">
                    <div className="mt-6 space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">Search Results for "{searchValue}"</h2>
                    </div>
                    <Separator className="my-4" />
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {isSearchLoading ? (
                          Array(6)
                            .fill(null)
                            .map((_, i) => (
                              <LoadingAlbumArtwork key={i} width={150} height={200} />
                            ))
                        ) : (
                          searchResults?.data.results.map((d, i) => (
                            <AlbumArtwork
                              key={i}
                              name={d.name}
                              img={d.image[2].url}
                              category={d.album.name}
                              handleDownload={() => downloadImage(d.downloadUrl[4].url, d.name)}
                              onClick={() => {
                                setMusicUrl(d.downloadUrl[4].url);
                                setCurrentArtist(d.primaryArtists);
                              }}
                            />
                          ))
                        )}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Audio Player */}
      {musicUrl && (
        <AudioPlayer
          src={musicUrl}
          onPlay={(e) => console.log("onPlay")}
          // other props you may want to use
        />
      )}
    </div>
  );
}
