"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw } from "lucide-react";

export default function CreativeNameGenerator() {
    const [role, setRole] = useState("");
    const [format, setFormat] = useState("");
    const [creation, setCreation] = useState("");
    const [product, setProduct] = useState("");
    const [category, setCategory] = useState("");
    const [angle, setAngle] = useState("");
    const [customAngle, setCustomAngle] = useState("");
    const [variation, setVariation] = useState(false);
    const [variationNumber, setVariationNumber] = useState("");
    const [creativeDate, setCreativeDate] = useState("");
    const [mediaBuyer, setMediaBuyer] = useState("");
    const [adType, setAdType] = useState("");
    const [creativeNameInput, setCreativeNameInput] = useState("");
    const [generatedName, setGeneratedName] = useState("");
    const [today, setToday] = useState("");
    const [copied, setCopied] = useState(false);
    const [fileExtension, setFileExtension] = useState("");

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
        setToday(formattedDate);
    }, []);

    // Format entity: convert spaces to dots for the name generation
    const formatEntity = (text: string) => {
        if (!text) return "";
        return text
            .split(' ')
            .map(word => word.trim())
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('.');
    };

    const resetFields = () => {
        setFormat("");
        setCreation("");
        setProduct("");
        setCategory("");
        setAngle("");
        setCustomAngle("");
        setVariation(false);
        setVariationNumber("");
        setCreativeDate("");
        setMediaBuyer("");
        setAdType("");
        setCreativeNameInput("");
        setGeneratedName("");
        setCopied(false);
        setFileExtension("");
    };

    const extractFileExtension = (name: string): string => {
        const match = name.match(/\.(mp4|png|jpg|jpeg)$/i);
        return match ? match[0].toLowerCase() : "";
    };

    const parseCreativeName = (name: string) => {
        if (!name) {
            setFileExtension("");
            return;
        }
        
        const ext = extractFileExtension(name);
        setFileExtension(ext);
        
        const cleanName = name.replace(/\.(mp4|png|jpg|jpeg)$/i, '');
        const parts = cleanName.split('_');
        
        if (parts.length >= 6) {
            const normalizedParts = parts.map(p => p.toUpperCase().trim());
            
            setFormat(normalizedParts[0] || "");
            setCreation(normalizedParts[1] || "");
            
            const knownCategories = ["AN", "BR", "ER", "NK", "RG", "ST", "SHS"];
            let foundCategoryIndex = -1;
            
            for (let i = 2; i < normalizedParts.length; i++) {
                if (knownCategories.includes(normalizedParts[i])) {
                    foundCategoryIndex = i;
                    break;
                }
            }
            
            if (foundCategoryIndex > 2) {
                const productParts = parts.slice(2, foundCategoryIndex);
                const productValue = productParts.join(' ').replace(/\./g, ' ').trim();
                setProduct(productValue);
                
                setCategory(normalizedParts[foundCategoryIndex] || "");
                
                const remainingParts = parts.slice(foundCategoryIndex + 1);
                const remainingNormalized = normalizedParts.slice(foundCategoryIndex + 1);
                
                if (remainingNormalized.length >= 2) {
                    const variationPart = remainingNormalized[remainingNormalized.length - 2];
                    const datePart = remainingNormalized[remainingNormalized.length - 1];
                    
                    const angleParts = remainingParts.slice(0, -2);
                    const angleValue = angleParts.join(' ').replace(/\./g, ' ').trim();
                    
                    // Map angles (case-insensitive, handle both dot and space versions)
                    const angleMap: { [key: string]: string } = {
                        "UGC": "UGC",
                        "EGC": "EGC",
                        "SINGLE IMAGE": "Single Image",
                        "SINGLEIMAGE": "Single Image",
                        "SINGLE.IMAGE": "Single Image",
                        "STORYTELLING": "Storytelling",
                        "TESTIMONIAL": "Customer Testimonial",
                        "CUSTOMER TESTIMONIAL": "Customer Testimonial",
                        "CUSTOMERTESTIMONIAL": "Customer Testimonial",
                        "CUSTOMER.TESTIMONIAL": "Customer Testimonial"
                    };
                    
                    const angleKey = angleValue.toUpperCase().replace(/\s+/g, '');
                    if (angleMap[angleKey]) {
                        setAngle(angleMap[angleKey]);
                        setCustomAngle("");
                    } else {
                        setAngle("Other");
                        setCustomAngle(angleValue);
                    }
                    
                    if (variationPart.startsWith('V')) {
                        const varNum = variationPart.substring(1);
                        if (varNum === "00") {
                            setVariation(false);
                            setVariationNumber("");
                        } else {
                            setVariation(true);
                            setVariationNumber(parseInt(varNum).toString());
                        }
                    }
                    
                    setCreativeDate(datePart || "");
                }
            }
        }
    };

    const handleCreativeNameChange = (value: string) => {
        setCreativeNameInput(value);
        parseCreativeName(value);
    };

    const generateName = () => {
        // Format product with dots
        const formattedProduct = formatEntity(product);
        
        // Format angle with dots (whether it's from dropdown or custom)
        const baseAngle = angle === "Other" ? formatEntity(customAngle) : formatEntity(angle);
        
        const variationCode = variation && variationNumber 
            ? `V${String(variationNumber).padStart(2, '0')}` 
            : "V00";
        
        const dateSuffix = role === "Media buyer" 
            ? (creativeDate ? `_${creativeDate}` : "")
            : (today ? `_${today}` : "");

        if (role === "Media buyer") {
            const name = `${adType}_${mediaBuyer}_${format}_${creation}_${formattedProduct}_${category}_${baseAngle}_${variationCode}${dateSuffix}${fileExtension}`;
            setGeneratedName(name);
        } else {
            const name = `${format}_${creation}_${formattedProduct}_${category}_${baseAngle}_${variationCode}${dateSuffix}`;
            setGeneratedName(name);
        }
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (generatedName) {
            navigator.clipboard.writeText(generatedName);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl"
            >
                <Card className="rounded-2xl shadow-lg">
                    <CardContent className="p-6 space-y-6">
                        <h1 className="text-2xl font-semibold text-center">Creative & Ad Name Generator</h1>

                        <div className="space-y-4">
                            {/* Role Selection - Full Width */}
                            <div>
                                <Label>Role</Label>
                                <Select value={role} onValueChange={(value) => {
                                    setRole(value);
                                    resetFields();
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Designer">Designer</SelectItem>
                                        <SelectItem value="Media buyer">Media buyer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Media Buyer Specific Fields */}
                            {role === "Media buyer" && (
                                <>
                                    {/* Creative Name - Full Width */}
                                    <div>
                                        <Label>Creative Name (paste existing creative name with extension)</Label>
                                        <Input 
                                            value={creativeNameInput} 
                                            onChange={(e) => handleCreativeNameChange(e.target.value)} 
                                            placeholder="e.g., VI_SS_Ariana.Blossom_NK_UGC_V00_17.02.2026.mp4"
                                            className="w-full"
                                        />
                                        {fileExtension && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Detected format: {fileExtension}
                                            </p>
                                        )}
                                    </div>

                                    {/* Media Buyer and Ad Type - One Line */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Media Buyer</Label>
                                            <Select value={mediaBuyer} onValueChange={setMediaBuyer}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Media Buyer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TG">Tanmoy Gantoit (TG)</SelectItem>
                                                    <SelectItem value="AK">Amit Kashyap (AK)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Ad Type</Label>
                                            <Select value={adType} onValueChange={setAdType}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Ad Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NC">New Creative (NC)</SelectItem>
                                                    <SelectItem value="SC">Scaling (SC)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Format, Creator, Product - One Line */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Format</Label>
                                    <Select value={format} onValueChange={setFormat}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VI">Video Image (VI)</SelectItem>
                                            <SelectItem value="IA">Static Image (IA)</SelectItem>
                                            <SelectItem value="IC">Carousel (IC)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Creator</Label>
                                    <Select value={creation} onValueChange={setCreation}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Creator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SS">Satnam Singh (SS)</SelectItem>
                                            <SelectItem value="AS">Amisha Sofat (AS)</SelectItem>
                                            <SelectItem value="MS">Manisha Sunar (MS)</SelectItem>
                                            <SelectItem value="SP">Spied (SP)</SelectItem>
                                            <SelectItem value="LP">Landing Page (LP)</SelectItem>
                                            <SelectItem value="WM">What More (WM)</SelectItem>
                                            <SelectItem value="CA">Catalogue (CA)</SelectItem>
                                            <SelectItem value="AI">AI Tool (AI)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Product</Label>
                                    <Input 
                                        value={product} 
                                        onChange={(e) => setProduct(e.target.value)} 
                                        placeholder="Ariana Blossom"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Category and Angle - One Line */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AN">Anklet (AN)</SelectItem>
                                            <SelectItem value="BR">Bracelet (BR)</SelectItem>
                                            <SelectItem value="ER">Earring (ER)</SelectItem>
                                            <SelectItem value="NK">Necklace (NK)</SelectItem>
                                            <SelectItem value="RG">Ring (RG)</SelectItem>
                                            <SelectItem value="ST">Set (ST)</SelectItem>
                                            <SelectItem value="SHS">Shoulder Strap (SHS)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Angle</Label>
                                    <Select value={angle} onValueChange={setAngle}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Angle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UGC">UGC</SelectItem>
                                            <SelectItem value="EGC">EGC</SelectItem>
                                            <SelectItem value="Single Image">Single Image</SelectItem>
                                            <SelectItem value="Storytelling">Storytelling</SelectItem>
                                            <SelectItem value="Customer Testimonial">Customer Testimonial</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {angle === "Other" && (
                            <div>
                                <Label>Custom Angle</Label>
                                <Input 
                                    value={customAngle} 
                                    onChange={(e) => setCustomAngle(e.target.value)} 
                                    placeholder="e.g., Customer Testimonial"
                                    className="w-full"
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                checked={variation}
                                onCheckedChange={(checked) => setVariation(checked === true)}
                            />
                            <Label>Variation (defaults to V00 if unchecked)</Label>
                        </div>

                        {variation && (
                            <div>
                                <Label>Variation Number</Label>
                                <Input 
                                    value={variationNumber} 
                                    onChange={(e) => setVariationNumber(e.target.value)} 
                                    placeholder="Enter Variation Number (e.g., 1, 2, 5)" 
                                    type="number"
                                    min="1"
                                    className="w-full"
                                />
                            </div>
                        )}

                        {/* Button Row - Full Width */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button 
                                variant="outline" 
                                onClick={resetFields}
                                className="w-full"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Fields
                            </Button>
                            <Button 
                                onClick={generateName}
                                className="w-full"
                            >
                                Generate Name
                            </Button>
                        </div>

                        {/* Generated Name Section with Copy Button */}
                        {generatedName && (
                            <div className="p-4 bg-gray-100 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Generated Name:</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className={copied ? "bg-green-100 text-green-700 border-green-300" : ""}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <p className="text-lg font-medium break-words font-mono bg-white p-3 rounded border border-gray-200">
                                    {generatedName}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}