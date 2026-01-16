import { supabase } from "../lib/supabaseClient";

export const adminApi = {
  getCampaigns: async () => {
    const { data, error } = await supabase
      .from("campaign_stats")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  getDonations: async () => {
    const { data, error } = await supabase
      .from("donations")
      .select(`*, campaign_stats ( title )`);
    if (error) throw error;
    return data;
  },

  uploadImage: async (file) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("campaign-images")
      .upload(`public/${fileName}`, file);

    if (uploadError) throw uploadError;

    const { data, error: publicUrlError } = await supabase.storage
      .from("campaign-images")
      .getPublicUrl(`public/${fileName}`);
    if (publicUrlError) throw publicUrlError;
    return data.publicUrl;
  },

  createCampaign: async (campaignData) => {
    const { data, error } = await supabase
      .from("campaigns")
      .insert([campaignData]);
    if (error) throw error;
    return data;
  },

  deleteCampaign: async (id) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) throw error;
  },

  updateCampaign: async (id, campaignData) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(campaignData) 
      .eq('id', id);        

    if (error) throw error;
    return data;
  },

  
  
  getGallery: async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  
  createGalleryItem: async (payload) => {
    const { data, error } = await supabase
      .from('gallery')
      .insert([payload])
      .select();
    if (error) throw error;
    return data;
  },

  
  deleteGalleryItem: async (id) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  
  uploadImage: async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('images') // Pastikan bucket 'images' sudah ada
      .upload(fileName, file);
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  }
};
